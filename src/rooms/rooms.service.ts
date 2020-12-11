import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Beer } from 'src/beers/beer.entity';
import { CreateBeerDto } from 'src/beers/dto/create-beer.dto';
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
    @InjectRepository(Beer)
    private beersRepository: Repository<Beer>,
  ) {}

  public async create(createRoomDto: CreateRoomDto, user: any): Promise<Room> {
    const creator = await this.usersRepository.findOne({ email: user.email });
    let room = new Room();
    room.name = createRoomDto.name;
    room.passcode = createRoomDto.passcode;
    room.creator = creator;
    room.createdAt = new Date();
    room.startedAt = new Date(0);
    room.finishedAt = new Date(0);
    room.isPublished = false;

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
    const rooms = await this.roomsRepository.find({
      where: { isPublished: true },
      relations: ['creator'],
    });

    return rooms;
  }

  public async changeStatus(id: number, user: User) {
    let requester = await this.usersRepository.findOne({ email: user.email });
    let room = await this.roomsRepository.findOne({
      where: { id: id },
      relations: ['creator'],
    });

    if (room === undefined) throw new NotFoundException();

    if (requester.id === room.creator.id) {
      room.isPublished = !room.isPublished;
      room = await this.roomsRepository.save(room);
    } else {
      throw new UnauthorizedException();
    }

    return room;
  }

  public async addBeer(id: number, createBeerDto: CreateBeerDto, user: User) {
    const requester = await this.usersRepository.findOne({ email: user.email });
    const room = await this.roomsRepository.findOne({
      relations: ['creator'],
      where: { id: id },
    });

    if (requester.id === room.creator.id) {
      let beer: Beer = new Beer();
      beer.name = createBeerDto.name;
      beer.abv = createBeerDto.abv;
      beer.room = room;
      beer = await this.beersRepository.save(beer);
      return beer;
    } else {
      throw new UnauthorizedException();
    }
  }

  public async findAllBeers(id: number) {
    const beers = await this.beersRepository.find({
      relations: ['room'],
      where: {
        room: {
          id: id,
        },
      },
    });

    return beers;
  }

  public async deleteBeer(roomId: number, beerId: number, user: User) {
    let requester = await this.usersRepository.findOne({ email: user.email });
    let room = await this.roomsRepository.findOne({
      where: { id: roomId },
      relations: ['creator'],
    });

    if (room === undefined) throw new NotFoundException();

    if (requester.id === room.creator.id) {
      let beer = await this.beersRepository.findOne({ id: beerId });
      beer = await this.beersRepository.remove(beer);
    } else {
      throw new UnauthorizedException();
    }
    return new DeleteResult();
  }
}
