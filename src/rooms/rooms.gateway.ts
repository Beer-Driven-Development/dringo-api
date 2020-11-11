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
  handleMessage(client: Socket, @MessageBody() payload: string): string {
    return 'Hello world!';
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('joinRoom')
  async handleRoomJoin(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: any,
  ) {
    const currentRoom = await this.roomsRepository.findOne({
      id: payload.data.id,
    });
    console.log(payload);

    const roomId = currentRoom.id.toString();
    if (currentRoom && currentRoom.passcode === payload.data.passcode) {
      if (payload.user) this.wsClients.push(client);
      client.send('joinedRoom');
      client.join(roomId);
      this.logger.log(this.wss.listenerCount);
      this.broadcast(
        `${payload.user.username} has joined room ${currentRoom.name}`,
      );

      client.to(roomId).emit('joinedRoom', roomId);
    } else {
      client.send('accessDenied');
    }
  }

  @SubscribeMessage('leaveRoom')
  async handleRoomLeave(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ) {
    const currentRoom = await this.roomsRepository.findOne({ id: data[0].id });

    if (currentRoom) {
      // client.join(currentRoom.id.toString());
      client.leave('room');
    }
  }

  wsClients = [];
  private broadcast(message: string) {
    for (let c of this.wsClients) {
      c.send(message);
    }
  }
}
