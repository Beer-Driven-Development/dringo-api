import { Logger, Param, Req, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { from, Observable } from 'rxjs';
import { Server, Socket } from 'socket.io';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { WsJwtGuard } from 'src/auth/ws-jwt-auth.guard';
import { User } from 'src/users/entities/user.entity';
import { GetUser } from 'src/users/user.decorator';
import { Repository } from 'typeorm';
import { Room } from './entities/room.entity';

@WebSocketGateway()
export class RoomsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    @InjectRepository(Room) private roomsRepository: Repository<Room>,
  ) {}
  handleDisconnect(client: any) {
    return 'Client has disconnected';
  }

  private logger: Logger = new Logger('RoomsGateway');

  async afterInit(server: Server) {
    this.logger.log('Initialized Websocket Server');
  }
  @WebSocketServer() wss: Server;

  async handleConnection() {
    return 'connect';
  }

  @SubscribeMessage('message')
  handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: string,
  ) {
    client.emit('message', 'message');
    console.log('message emitted');
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('joinRoom')
  async handleRoomJoin(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: any,
  ) {
    const currentRoom = await this.roomsRepository.findOne({
      id: payload.id,
    });
    console.log(payload);

    const roomId = currentRoom.id.toString();
    if (currentRoom && currentRoom.passcode === payload.passcode) {
      if (payload.user) this.wsClients.push(client);
      // client.send('joinedRoom');
      // client.emit('joinedRoom', 'kurde faja');
      client.join(roomId);
      // this.broadcast(
      //   `${payload.user.username} has joined room ${currentRoom.name}`,
      // );
      this.broadcast(
        'joinedRoom',
        `${payload.user.username} has joined room ${currentRoom.name}`,
      );
      client.to(roomId).emit('joinedRoom', 'na tym polega odpowiedzialnosc');
    } else {
      client.send('accessDenied');
    }
  }

  @SubscribeMessage('leaveRoom')
  async handleRoomLeave(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: any,
  ) {
    const currentRoom = await this.roomsRepository.findOne({
      id: payload.id,
    });

    if (currentRoom) {
      // client.join(currentRoom.id.toString());
      client.leave('room');
    }
  }

  wsClients = [];
  private broadcast(message: string, data: string) {
    for (let c of this.wsClients) {
      c.emit(message, data);
    }
  }
}
