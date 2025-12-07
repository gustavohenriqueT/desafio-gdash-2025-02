import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateWeatherDto } from './dto/create-weather.dto';
import { WeatherLog } from './schemas/weather-log.schema';
import { Parser } from 'json2csv';

@Injectable()
export class WeatherService {
  constructor(
    @InjectModel(WeatherLog.name) private weatherModel: Model<WeatherLog>,
  ) {}

  async create(createWeatherDto: CreateWeatherDto) {
    const createdLog = new this.weatherModel(createWeatherDto);
    return createdLog.save();
  }

  async findAll() {
    return this.weatherModel.find().sort({ createdAt: -1 }).exec();
  }

  findOne(id: number) {
    return `Not implemented`;
  }

  update(id: number, updateWeatherDto: any) {
    return `Not implemented`;
  }

  remove(id: number) {
    return `Not implemented`;
  }

  async generateInsights() {
    const logs = await this.weatherModel.find().sort({ createdAt: -1 }).limit(5).exec();

    if (logs.length < 2) {
      return {
        summary: "Dados insuficientes para análise.",
        trend: "Estável",
        alert: "Aguardando mais dados...",
      };
    }

    const current = logs[0];
    const previous = logs[logs.length - 1];

    let trend = "Estável";
    if (current.temperature > previous.temperature + 0.5) {
      trend = "Subindo";
    } else if (current.temperature < previous.temperature - 0.5) {
      trend = "Caindo";
    }

    let alert = "Clima agradável. Aproveite!";
    if (current.temperature > 30) alert = "Calor excessivo! Hidrate-se.";
    if (current.temperature < 15) alert = "Temperatura baixa. Leve um casaco.";
    if (current.humidity < 30) alert = "Umidade muito baixa. Cuidado com exercícios.";
    if (current.condition.toLowerCase().includes('rain') || current.condition.toLowerCase().includes('chuva')) {
        alert = "Possibilidade de chuva. Leve guarda-chuva.";
    }

    const averageTemp = logs.reduce((acc, curr) => acc + curr.temperature, 0) / logs.length;

    return {
      summary: `Média de ${averageTemp.toFixed(1)}°C nas últimas leituras.`,
      trend: trend,
      alert: alert,
    };
  }

  async exportToCsv() {
    const logs = await this.weatherModel.find().sort({ createdAt: -1 }).exec();
    const data = logs.map(log => ({
      Cidade: log.city,
      Temperatura: log.temperature,
      Umidade: log.humidity,
      Vento: log.windSpeed,
      Condicao: log.condition,
      Data: log.createdAt ? log.createdAt.toISOString() : '',
    }));

    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(data);

    return csv;
  }
}
