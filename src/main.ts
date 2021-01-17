import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('bootstrap');
  const app = await NestFactory.create(AppModule);
  const origin =
    process.env.CORS_ORIGIN ||
    'http://nestjs-task-management-frontend-anhpn.s3-website-ap-southeast-1.amazonaws.com';
  if (process.env.NODE_ENV === 'dev') app.enableCors();
  else app.enableCors({ origin });
  logger.log(`Accepting request from origin ${origin}`);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  logger.log(`Application listening on port ${port}`);
}
bootstrap();
