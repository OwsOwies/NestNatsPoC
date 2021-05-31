import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController, clientService, FirstMicroController, SecondMicroController } from './app.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: clientService,
        transport: Transport.NATS,
        options: {
          url: 'nats://localhost:4222'
        }
      }
    ]),
  ],
  controllers: [AppController],
})
export class AppModule {}


@Module({
  imports: [
    ClientsModule.register([
      {
        name: clientService,
        transport: Transport.NATS,
        options: {
          url: 'nats://localhost:4222'
        }
      }
    ]),
  ],
  controllers: [FirstMicroController],
})
export class FirstMicroModule {}

@Module({
  controllers: [SecondMicroController],
})
export class SecondMicroModule {}