/* eslint-disable no-console */
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import * as morgan from 'morgan';

async function bootstrap() {
  const port = process.env.PORT || 4001;
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || [],
  });
  app.use(compression());
  app.use(cookieParser());
  app.use(helmet());
  app.use(morgan(':date[iso] - :method - :url - :status - :response-time ms'));
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  await app.listen(port, () => console.log(`Server started on port ${port}`));
}
bootstrap();
