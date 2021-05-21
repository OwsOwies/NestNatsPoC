import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController, FirstMicroController } from './app.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'NATS_CLIENT_SERVICE',
        transport: Transport.TCP,
      }
    ]),
  ],
  controllers: [AppController],
})
export class AppModule {}


@Module({
  controllers: [FirstMicroController],
})
export class FirstMicroModule {}