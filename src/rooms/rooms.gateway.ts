import { Logger, Param, Req, UseGuards } from '@nestjs/common';
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
import { WsJwtGuard } from 'src/auth/ws-jwt-auth.guard';
import { User } from 'src/users/entities/user.entity';
import { GetUser } from 'src/users/user.decorator';
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

  async handleConnection() {
    console.log('Someone connected!');
  }

  @SubscribeMessage('message')
  handleMessage(client: Socket, @MessageBody() payload: string): string {
    return 'Hello world!';
  }

  // @UseGuards(WsJwtGuard)
  @SubscribeMessage('joinRoom')
  async handleRoomJoin(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ) {
    const currentRoom = await this.roomsRepository.findOne({ id: data[0].id });
    console.log(data);

    const roomId = currentRoom.id.toString();
    if (currentRoom && currentRoom.passcode === data[0].passcode) {
      if (data.user) this.wsClients.push(client);
      // client.send('joinedRoom');
      await client.join(roomId, function() {
        client.to(roomId).emit('joinedRoom HEHEHEHHE');
      });
      // this.broadcast(
      //   `${data.user.username} has joined room ${currentRoom.name}`,
      // );

      // client.to(roomId).emit('joinedRoomheheheh', roomId);
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
