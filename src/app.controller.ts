import { Controller, Get, Inject, Render } from '@nestjs/common';
import { ClientProxy, EventPattern, MessagePattern } from '@nestjs/microservices';
import { Observable } from 'rxjs';

@Controller()
export class AppController {
  public constructor(
    @Inject('NATS_CLIENT_SERVICE')
    private readonly client: ClientProxy
  ) {}

  @Get()
  @Render('index')
  public root(): void {
    // NOOP
  }

  @Get('ping')
  public ping(): Observable<string> {
    return this.client.send({ cmd: 'pingRequest' }, {})
  }
}

@Controller()
// https://docs.nestjs.com/microservices/basics
export class FirstMicroController {
  @MessagePattern({ cmd: 'pingRequest' })
  // duplex
  public async testRequestResponse(): Promise<string> {
    return 'pongResponse';
  }

  @EventPattern('pingEvent')
  // simplex
  public async handleEvent(): Promise<void> {
    console.log('pongEvent was recieved')
  }
}