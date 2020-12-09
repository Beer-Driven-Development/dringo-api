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
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}
  handleDisconnect(client: any) {
    return 'Client has disconnected';
  }

  private logger: Logger = new Logger('RoomsGateway');
  connectedUsers = new Map<Room, User[]>();

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

  // @UseGuards(WsJwtGuard)
  @SubscribeMessage('start')
  async handleStart(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: any,
  ) {
    console.log(payload);
    // let currentRoom = await this.roomsRepository.findOne({
    //   where: {
    //     id: payload.id,
    //     // creator: {
    //     //   id: payload.user.id,
    //     // },
    //   },
    //   relations: ['creator', 'participants'],
    // });
    // currentRoom.startedAt = new Date();
    let participants = [];
    let clients = client.adapter.rooms[payload.id];

    // this.wss
    //   .in(payload.id)
    //   .clients((error, consumers) => console.log(consumers));
    console.log(clients);
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
      client.join(roomId);
      if (!this.connectedUsers.has(currentRoom)) {
        this.connectedUsers.set(currentRoom, []);
      }

      const user = await this.usersRepository.findOne({
        email: payload.user.email,
      });
      if (!user) {
        client.emit('accessDenied', 'Access denied');
      }
      this.connectedUsers.get(currentRoom).push(user);
      this.updateUsersList(client, currentRoom);
    } else {
      client.emit('accessDenied', 'Access denied');
    }
  }

  private updateUsersList(client: Socket, room: Room) {
    client.to(room.id.toString()).emit('usersList', {
      room: room,
      users: this.connectedUsers.get(room),
    });
    console.log(this.connectedUsers.get(room));
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('leaveRoom')
  async handleRoomLeave(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: any,
  ) {
    const currentRoom = await this.roomsRepository.findOne({
      id: payload.id,
    });

    const user = await this.usersRepository.findOne({
      email: payload.user.email,
    });

    if (currentRoom) {
      let userList = this.connectedUsers.get(currentRoom);
      userList = userList.filter(u => u !== user);
      if (!userList.length) {
        this.connectedUsers.delete(currentRoom);
      } else {
        this.connectedUsers.set(currentRoom, userList);
        this.updateUsersList(client, currentRoom);
      }
      client.leave('room');
    }
  }
}
