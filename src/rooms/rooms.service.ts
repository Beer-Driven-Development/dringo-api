import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { CreateRoomDto } from './dto/create-room.dto';
import { Room } from './entities/room.entity';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room)
    private roomsRepository: Repository<Room>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  public async create(createRoomDto: CreateRoomDto, user: any): Promise<Room> {
    const creator = await this.usersRepository.findOne({ email: user.email });
    let room = new Room();
    room.name = createRoomDto.name;
    room.passcode = createRoomDto.passcode;
    room.creator = creator;

    room = await this.roomsRepository.save(room);

    return room;
  }
}
