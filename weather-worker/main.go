package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"

	amqp "github.com/rabbitmq/amqp091-go"
)

type WeatherData struct {
	City        string  `json:"city"`
	Temperature float64 `json:"temperature"`
	Humidity    float64 `json:"humidity"`
	WindSpeed   float64 `json:"windSpeed"`
	Condition   string  `json:"condition"`
}

func main() {
	rabbitMQURL := os.Getenv("RABBITMQ_URL")
	if rabbitMQURL == "" {
		rabbitMQURL = "amqp://admin:admin123@localhost:5672/"
	}

	apiURL := os.Getenv("API_URL")
	if apiURL == "" {
		apiURL = "http://127.0.0.1:3000/weather"
	}

	conn, err := amqp.Dial(rabbitMQURL)
	failOnError(err, "Falha ao conectar no RabbitMQ")
	defer conn.Close()

	ch, err := conn.Channel()
	failOnError(err, "Falha ao abrir canal")
	defer ch.Close()

	q, err := ch.QueueDeclare(
		"weather_queue",
		false,
		false,
		false,
		false,
		nil,
	)
	failOnError(err, "Falha ao declarar fila")

	msgs, err := ch.Consume(
		q.Name,
		"",
		false,
		false,
		false,
		false,
		nil,
	)
	failOnError(err, "Falha ao registrar consumidor")

	forever := make(chan struct{})
	go func() {
		for d := range msgs {
			log.Printf("Recebido: %s", d.Body)

			var data WeatherData
			err := json.Unmarshal(d.Body, &data)
			if err != nil {
				log.Printf("Erro ao ler JSON: %s", err)
				d.Nack(false, false)
				continue
			}

			if data.Temperature > 50 {
				log.Println("Alerta: Temperatura suspeita (muito alta)!")
			}

			err = sendToAPI(apiURL, data)
			if err != nil {
				log.Printf("Erro ao enviar para API: %s", err)
				d.Nack(false, true)
			} else {
				log.Println("Sucesso! Salvo no Banco.")
				d.Ack(false)
			}
		}
	}()

	log.Printf(" [*] Worker Go aguardando mensagens. Para sair pressione CTRL+C")
	<-forever
}

func sendToAPI(url string, data WeatherData) error {
	jsonData, err := json.Marshal(data)
	if err != nil {
		return err
	}

	resp, err := http.Post(url, "application/json", bytes.NewBuffer(jsonData))
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode != 201 {
		return fmt.Errorf("API retornou status: %d", resp.StatusCode)
	}
	return nil
}

func failOnError(err error, msg string) {
	if err != nil {
		log.Fatalf("%s: %s", msg, err)
	}
}
