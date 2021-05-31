import { Controller, Get, Inject, Render } from '@nestjs/common';
import { ClientProxy, EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Controller()
export class AppController {
  public constructor(
    @Inject('NATS_CLIENT_SERVICE')
    private readonly client: ClientProxy
  ) {}

  @Get()
  @Render('index')
  public root(): void {
    // NOOP - just return html
  }

  @Get('pingWithResponse')
  public pingWithResponse(): Observable<string> {
    return this.client.send('pingRequest', {});
  }

  @Get('pingWithoutResponse')
  public pingWithoutResponse(): void {
    this.client.emit('pingEvent', {});
  }

  @Get('pingWithComplexWithResponse')
  public pingWithComplexWithResponse(): Observable<{}> {
    return this.client.send('pingWithComplexWithResponse', { someText: 'Passed by App Controller' })
      .pipe(map(payload => ({ someText: `${payload.someText} => Passed back from App Controller`})));
  }

  @Get('pingWithComplexWithoutResponse')
  public pingWithComplex(): void {
    this.client.emit('pingWithComplexWithoutResponse', { someText: 'Passed by AppController' });
  }
}

@Controller()
// https://docs.nestjs.com/microservices/basics
export class FirstMicroController {
  public constructor(
    @Inject('NATS_CLIENT_SERVICE')
    private readonly client: ClientProxy
  ) {}

  @MessagePattern('pingRequest')
  // duplex
  public async testRequestResponse(): Promise<string> {
    return 'pongResponse';
  }

  @EventPattern('pingEvent')
  // simplex
  public async handleEvent(): Promise<void> {
    console.log('pongEvent was recieved');
  }

  @MessagePattern('pingWithComplexWithResponse')
  public handleComplexWithResponse(@Payload() data: { someText: string }): Observable<{ someText: string }> {
    return this.client.send('passComplexWithResponse', { someText: `${data.someText} => Passed by FirstMicroController`})
      .pipe(map(payload => ({ someText: `${payload.someText} => Passed back from FirstMicroController`})));
  }

  @EventPattern('pingWithComplexWithoutResponse')
  public async handleComplex(@Payload() data: { someText: string}): Promise<void> {
    this.client.emit('passComplexPingWithoutResponse', {someText: `${data.someText} => Passed by FirstMicroController`});
  }
}

@Controller()
export class SecondMicroController {
  @MessagePattern('passComplexWithResponse')
  public async handleComplexWithResponse(@Payload() data: { someText: string }): Promise<{ someText: string }> {
    return { someText: `${data.someText} => Passed by SecondMicroController` };
  }

  @EventPattern('passComplexPingWithoutResponse')
  public async handleComplex(@Payload() data: { someText: string} ): Promise<void> {
    console.log('Complex ping received in Second MicroController with stack: ', data);
  }
}