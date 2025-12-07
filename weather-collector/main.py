import time
import json
import requests
import schedule
import pika
import os

RABBITMQ_HOST = os.getenv('RABBITMQ_HOST', 'localhost')
RABBITMQ_USER = os.getenv('RABBITMQ_USER', 'admin')
RABBITMQ_PASS = os.getenv('RABBITMQ_PASS', 'admin123')

CITY_NAME="São José do Rio Pardo"
CITY_LAT="-21.59"
CITY_LON="-46.88"

WEATHER_CODES = {
    0: "Céu limpo",
    1: "Principalmente limpo",
    2: "Parcialmente nublado",
    3: "Encoberto",
    45: "Nevoeiro",
    48: "Nevoeiro com geada",
    51: "Chuvisco leve",
    53: "Chuvisco moderado",
    55: "Chuvisco denso",
    61: "Chuva fraca",
    63: "Chuva moderada",
    65: "Chuva forte",
    80: "Pancadas de chuva",
    95: "Trovoada",
    96: "Trovoada com granizo",
    99: "Trovoada com granizo forte"
}

def get_weather():
    print(f"[{time.strftime('%H:%M:%S')}] Buscando dados do clima para {CITY_NAME}...")
    try:
        url = f"https://api.open-meteo.com/v1/forecast?latitude={CITY_LAT}&longitude={CITY_LON}&current_weather=true"
        response = requests.get(url)
        data = response.json()

        if 'current_weather' in data:
            current = data['current_weather']
            wmo_code = current.get('weathercode')
            condition_text = WEATHER_CODES.get(wmo_code, "Desconhecido")
            
            payload = {
                "city": CITY_NAME, 
                "temperature": current['temperature'],
                "windSpeed": current['windspeed'],
                "condition": condition_text,
                "humidity": 50
            }

            send_to_queue(payload)
        else:
            print("Erro: Dados inválidos da API")

    except Exception as e:
        print(f"Erro ao buscar clima: {e}")

def send_to_queue(payload):
    try:
        credentials = pika.PlainCredentials(RABBITMQ_USER, RABBITMQ_PASS)
    
        parameters = pika.ConnectionParameters(
            host=RABBITMQ_HOST, 
            credentials=credentials
        )
        
        connection = pika.BlockingConnection(parameters)
        channel = connection.channel()

        channel.queue_declare(queue='weather_queue')

        message = json.dumps(payload)
        channel.basic_publish(exchange='', routing_key='weather_queue', body=message)
        
        print(f"Enviado para fila: {payload['condition']} | {payload['temperature']}°C")
        connection.close()
    except Exception as e:
        print(f"❌ Erro de conexão com RabbitMQ: {e}")

if __name__ == "__main__":
    print("🚀 Coletor iniciado! Rodando a cada 10 segundos...")

    get_weather()
    schedule.every(10).seconds.do(get_weather)
    while True:
        schedule.run_pending()
        time.sleep(1)