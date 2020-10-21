import { Logger, Param } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Repository } from 'typeorm';
import { Room } from './entities/room.entity';

@WebSocketGateway({ namespace: '/rooms' })
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
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }

  @SubscribeMessage('joinRoom')
  async handleRoomJoin(
    @ConnectedSocket() client: Socket,
    @MessageBody() id: number,
  ) {
    const currentRoom = await this.roomsRepository.findOne({ id });
    console.log(id);

    if (currentRoom) {
      client.join(currentRoom.id.toString());
      client.emit('joinedRoom', currentRoom.id);
    }
  }
}
