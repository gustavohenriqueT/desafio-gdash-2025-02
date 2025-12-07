import { Controller, Get, Post, Body, Res } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { CreateWeatherDto } from './dto/create-weather.dto';
import type { Response } from 'express'; // <--- Correção aqui

@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Post()
  create(@Body() createWeatherDto: CreateWeatherDto) {
    return this.weatherService.create(createWeatherDto);
  }

  @Get('insights')
  getInsights() {
    return this.weatherService.generateInsights();
  }

  @Get()
  findAll() {
    return this.weatherService.findAll();
  }

  @Get('export/csv')
  async downloadCsv(@Res() res: Response) {
    const csvData = await this.weatherService.exportToCsv();

    res.set({
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename="clima_logs.csv"',
    });

    res.send(csvData);
  }
}