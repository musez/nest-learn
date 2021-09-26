import { WebSocketGateway, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import * as WebSocket from 'ws';
import { WsService } from './ws.service';
import { CreateWDto } from './dto/create-w.dto';
import { UpdateWDto } from './dto/update-w.dto';

@WebSocketGateway(3002)
export class WsGateway {
  constructor(private readonly wsService: WsService) {}

  @SubscribeMessage('hello')
  hello(@MessageBody() data: any): any {
    return {
      "event": "hello",
      "data": data,
      "msg": 'rustfisher.com'
    };
  }

  @SubscribeMessage('hello2')
  hello2(@MessageBody() data: any, @ConnectedSocket() client: WebSocket): any {
    console.log('收到消息 client:', client);
    client.send(JSON.stringify({ event: 'tmp', data: '这里是个临时信息' }));
    return { event: 'hello2', data: data };
  }

  // @SubscribeMessage('createW')
  // create(@MessageBody() createWDto: CreateWDto) {
  //   return this.wsService.create(createWDto);
  // }
  //
  // @SubscribeMessage('findAllWs')
  // findAll() {
  //   return this.wsService.findAll();
  // }
  //
  // @SubscribeMessage('findOneW')
  // findOne(@MessageBody() id: number) {
  //   return this.wsService.findOne(id);
  // }
  //
  // @SubscribeMessage('updateW')
  // update(@MessageBody() updateWDto: UpdateWDto) {
  //   return this.wsService.update(updateWDto.id, updateWDto);
  // }
  //
  // @SubscribeMessage('removeW')
  // remove(@MessageBody() id: number) {
  //   return this.wsService.remove(id);
  // }
}
