import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
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
    room.createdAt = new Date();

    room = await this.roomsRepository.save(room);

    return room;
  }

  public async delete(id: number, user: any) {
    let requester = await this.usersRepository.findOne({ email: user.email });
    let room = await this.roomsRepository.findOne({
      where: { id: id },
      relations: ['creator'],
    });

    if (room === undefined) throw new NotFoundException();

    if (requester.id === room.creator.id)
      room = await this.roomsRepository.remove(room);
    else {
      throw new UnauthorizedException();
    }
    return new DeleteResult();
  }

  public async findAll() {
    const rooms = await this.roomsRepository.find();

    return rooms;
  }
}
