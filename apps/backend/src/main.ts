import * as dotenv from 'dotenv';
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WinstonLogger } from './common/logger/winston.logger';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonLogger
  });

  app.enableCors({
    // origin: 'http://localhost:5173',
    origin: true,
    credentials: true,
  });

  const server = app.getHttpAdapter().getInstance();
  server.set('trust proxy', true);

  app.useGlobalFilters(new GlobalExceptionFilter());

  await app.listen(process.env.PORT ?? 3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
