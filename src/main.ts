import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule, FirstMicroModule, SecondMicroModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');

  await app.listen(4200);

  const firstMicroService = await NestFactory.createMicroservice<MicroserviceOptions>(FirstMicroModule, {
    transport: Transport.NATS,
    options: {
      url: 'nats://localhost:4222'
    }
  });
  firstMicroService.listen().then(
    () => console.log('First microservice is listening'),
  );

  const secondMicroService = await NestFactory.createMicroservice<MicroserviceOptions>(SecondMicroModule, {
    transport: Transport.NATS,
    options: {
      url: 'nats://localhost:4222'
    }
  });
  secondMicroService.listen().then(
    () => console.log('Second microservice is listening'),
  );
}

bootstrap();
