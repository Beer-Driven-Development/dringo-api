import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Beer } from '../beers/beer.entity';
import { Category } from '../categories/category.entity';
import { Pivot } from '../categories/pivot.entity';
import { Rating } from '../ratings/rating.entity';
import { User } from '../users/entities/user.entity';
import { StartDto } from './dto/start.dto';
import { VoteDto } from './dto/vote.dto';
import { Room } from './entities/room.entity';

@Injectable()
export class DegustationsService {
  constructor(
    @InjectRepository(Room)
    private roomsRepository: Repository<Room>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Beer)
    private beersRepository: Repository<Beer>,
    @InjectRepository(Pivot)
    private pivotsRepository: Repository<Pivot>,
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
    @InjectRepository(Rating)
    private ratingsRepository: Repository<Rating>,
  ) {}

  public async start(roomId: number, startDto: StartDto, user: User) {
    let room = await this.roomsRepository.findOne({
      where: {
        id: roomId,
        creator: {
          id: user.id,
        },
      },
      relations: ['participants', 'creator'],
    });
    room.startedAt = new Date();
    startDto.participants.forEach(async participant => {
      const user = await this.usersRepository.findOne({
        where: {
          id: participant.id,
        },
      });
      room.participants.push(user);
    });

    room = await this.roomsRepository.save(room);

    const data = await this.getData(room);
    return data;
  }

  public async getDegustation(email: string, roomId: any) {
    const room = await this.roomsRepository.findOne({
      where: {
        id: roomId,
      },
      relations: ['participants'],
    });

    if (!room.participants.find(participant => participant.email == email)) {
      throw UnauthorizedException;
    }
    return await this.getData(room);
  }

  private async getData(room: Room) {
    const beers = await this.beersRepository.find({
      where: {
        room: {
          id: room.id,
        },
      },
      relations: ['room'],
    });

    const pivots = await this.pivotsRepository.find({
      where: {
        room: {
          id: room.id,
        },
      },
      relations: ['room', 'category'],
    });

    const data = {
      beers: beers,
      pivots: pivots,
    };

    return data;
  }

  public async vote(
    roomId: number,
    voteDto: VoteDto,
    user: User,
  ): Promise<Rating> {
    const beer = await this.beersRepository.findOne({ id: voteDto.beerId });
    const pivot = await this.pivotsRepository.findOne({ id: voteDto.pivotId });

    let rating = new Rating();
    rating.score = voteDto.score;
    rating.evaluator = user;
    rating.beer = beer;
    rating.pivot = pivot;

    rating = await this.ratingsRepository.save(rating);

    return rating;
  }
}
