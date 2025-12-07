import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type WeatherLogDocument = HydratedDocument<WeatherLog>;

@Schema({ timestamps: true })
export class WeatherLog {
  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  temperature: number;

  @Prop()
  humidity: number;

  @Prop()
  windSpeed: number;

  @Prop()
  condition: string;

  @Prop({ type: Object })
  raw_data: any; 

  createdAt: Date;
  updatedAt: Date;
}

export const WeatherLogSchema = SchemaFactory.createForClass(WeatherLog);