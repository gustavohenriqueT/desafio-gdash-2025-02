# 🌤️ GDash Weather - Desafio Full Stack (2025/02)

> Solução desenvolvida para o processo seletivo **GDASH 2025/02**.  
> Aplicação distribuída para monitoramento climático utilizando arquitetura de microsserviços, processamento assíncrono e coleta contínua de dados meteorológicos.

---

## 📹 Vídeo Demonstrativo

Assista à demonstração completa da arquitetura, execução dos serviços, login e funcionalidades:

👉 **[Clique aqui para assistir ao vídeo explicativo (YouTube)](https://youtu.be/VVqAvcn9wOQ?si=K041o4uQm5ReS1oi)**

---

## 🚀 Arquitetura Geral

A arquitetura é composta por cinco camadas:

1. **Ingestão (Python)**  
   - Gera ou coleta dados brutos.  
   - Envia mensagens para o **RabbitMQ**.

2. **Processamento (Go)**  
   - Consome mensagens do RabbitMQ.  
   - Realiza pré-processamento e enriquece os dados.  
   - Publica resultados no banco.

3. **Backend (NestJS API)**  
   - Expõe endpoints REST.  
   - Integra com MongoDB.  
   - Fornece dados ao frontend.  
   - Gera insights de IA.

4. **Banco de Dados (MongoDB)**  
   - Armazena logs, dados processados e resultados de IA.

5. **Frontend (React/Vite)**  
   - Dashboard para visualização.  
   - Exibe insights, métricas e logs do pipeline.

   graph LR
    A[Coletor Python] -->|Clima JSON| B(RabbitMQ)
    B -->|Consome Fila| C[Worker Go]
    C -->|Dados Tratados| D[NestJS API]
    D -->|Persistência| E[(MongoDB)]
    D -->|Insights| F[OpenAI/IA]
    G[Frontend React] -->|Requisições HTTP| D

---

## 🐳 Como rodar tudo via Docker Compose

A execução é **totalmente automatizada** com Docker.

### 1. Clone o repositório
```bash
git clone https://github.com/gustavohenriqueT/desafio-gdash-2025-02.git
cd desafio-gdash-2025-02
```

### 2. Suba todos os serviços (docker-compose)
```bash
docker-compose up --build -d
```

Serviços iniciados automaticamente:

- Python(collector) 
- Go (Worker)  
- NestJS API (Backend) 
- MongoDB (Banco)
- RabbitMQ (Message Broker)
- Frontend React  

#### 2.1. Derrubar todos os serviços (docker-compose)

```bash
docker-compose down
```

---

## 🐍 Como rodar o serviço Python (fora do Docker)

```bash
cd weather-collector
pip install -r requirements.txt
python main.py
```

---

## ⚙️ Como rodar o worker Go (fora do Docker)

```bash
cd weather-worker
go mod tidy
go run main.go
```

---

## 🧰 Como rodar o backend NestJS (fora do Docker)

```bash
cd backend
npm install
npm run start:dev
```

---

## 🌐 URLs Principais

| Serviço | URL |
|--------|-----|
| **Frontend** | http://localhost:5173 |
| **API Backend** | http://localhost:3000 |
| **RabbitMQ Dashboard** | http://localhost:15672 |
| **MongoDB** | Porta 27017 | Banco de persistência |
| **Swagger** | http://localhost:3000/api |

---

## 🔐 Usuário Padrão

```
Email: admin@example.com  
Senha: 123456
```

---

## 🤖 Insights de IA – Como funcionam

1. O Python envia dados brutos.  
2. O Go Worker pré-processa e normaliza o conteúdo.  
3. O Backend NestJS recebe e dispara análises de IA:  
   - Detecção de padrões  
   - Classificação  
   - Geração de insights  
4. Os insights são armazenados no MongoDB.  
5. O frontend consome a API e exibe em tempo real.

---

## 🧠 Decisões Técnicas Principais

- Uso de **RabbitMQ** para garantir resiliência e desacoplamento entre etapas.  
- **Go** Worker para máximo desempenho no consumo de filas.  
- **NestJS** pela robustez, escalabilidade e arquitetura modular.  
- Pipeline assíncrono para lidar com alto volume de dados.  
- **Docker Compose** para replicar produção localmente.  
- Uso de IA integrada ao backend para evitar sobrecarga no frontend.

---

## 📁 Estrutura do Repositório

```
/
├── backend/          # NestJS API
├── weather-collector/  # Serviço Python
├── weather-worker/        # Worker Go
├── frontend/         # React Dashboard
├── docker-compose.yml # Docker
├── README.md
└── READMEexec.md # READme de execução

```

---

## 📬 Contato

Projeto desenvolvido para processo seletivo técnico.  
Dúvidas: abra uma issue no repositório.

---


