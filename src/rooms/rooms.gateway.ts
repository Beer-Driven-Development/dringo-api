import { Logger, Param, UseGuards } from '@nestjs/common';
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
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from 'src/users/entities/user.entity';
import { GetUser } from 'src/users/user.decorator';
import { Repository } from 'typeorm';
import { Room } from './entities/room.entity';

@WebSocketGateway({ namespace: 'room' })
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

  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('joinRoom')
  async handleRoomJoin(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
    @GetUser() user: User,
  ) {
    const currentRoom = await this.roomsRepository.findOne({ id: data[0].id });
    console.log(data);

    if (currentRoom) {
      // client.join(currentRoom.id.toString());
      this.broadcast(
        'joinRoom',
        `${user.username} has joined room ${currentRoom.name}`,
      );
    }
  }

  @SubscribeMessage('leaveRoom')
  async handleRoomLeave(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ) {
    const currentRoom = await this.roomsRepository.findOne({ id: data[0].id });
    console.log(data);

    if (currentRoom) {
      // client.join(currentRoom.id.toString());
      client.leave('room');
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
