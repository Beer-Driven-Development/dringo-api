import { Logger, Param } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { from, Observable } from 'rxjs';
import { Server, Socket } from 'socket.io';
import { Repository } from 'typeorm';
import { Room } from './entities/room.entity';

@WebSocketGateway()
export class RoomsGateway implements OnGatewayInit {
  constructor(
    @InjectRepository(Room) private roomsRepository: Repository<Room>,
  ) {}

  private logger: Logger = new Logger('RoomsGateway');

  afterInit(server: any) {
    this.logger.log('Initialized!');
  }
  @WebSocketServer() wss: Server;

  @SubscribeMessage('message')
  handleMessage(client: Socket, @MessageBody() payload: string): string {
    return 'Hello world!';
  }

  @SubscribeMessage('joinRoom')
  async handleRoomJoin(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ) {
    const currentRoom = await this.roomsRepository.findOne({ id: data[0].id });
    console.log(data);

    if (currentRoom) {
      // client.join(currentRoom.id.toString());
      client.send('joinedRoom', currentRoom.id);
    }
  }
  wsClients = [];
  private broadcast(event, message: any) {
    const broadCastMessage = JSON.stringify(message);
    for (let c of this.wsClients) {
      c.send(event, broadCastMessage);
    }
  }

  @SubscribeMessage('my-event')
  onChgEvent(client: any, payload: any) {
    this.broadcast('my-event', payload);
  }
}
