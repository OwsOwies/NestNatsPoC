import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule, FirstMicroModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');

  await app.listen(4222);

  const firstMicroService = await NestFactory.createMicroservice<MicroserviceOptions>(FirstMicroModule, {
    transport: Transport.TCP,
  });
  firstMicroService.listen(() => console.log('First microservice is listening'));
}
bootstrap();
