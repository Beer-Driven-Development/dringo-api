import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
import { RedisIoAdapter } from './redis.adapter';
import { WsAdapter } from '@nestjs/platform-ws';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useWebSocketAdapter(new WsAdapter(app));
  await app.listen(process.env.PORT || 5000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
