import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from 'src/rooms/entities/room.entity';
import { User } from 'src/users/entities/user.entity';
import { DeleteResult, Repository } from 'typeorm';
import { Category } from './category.entity';
import { CreateCategoryDto } from './create-category.dto';
import { Pivot } from './pivot.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
    @InjectRepository(Pivot)
    private pivotsRepository: Repository<Pivot>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Room)
    private roomsRepository: Repository<Room>,
  ) {}

  public async add(
    id: number,
    createCategoryDto: CreateCategoryDto,
    user: User,
  ) {
    const requester = await this.usersRepository.findOne({ email: user.email });
    const room = await this.roomsRepository.findOne({
      relations: ['creator'],
      where: { id: id },
    });

    if (room === undefined) throw new NotFoundException();
    if (requester.id === room.creator.id) {
      const category = await this.categoriesRepository.findOne({
        id: createCategoryDto.id,
      });

      if (category === undefined) throw new NotFoundException();

      const existingPivot = await this.pivotsRepository.findOne({
        relations: ['category'],
        where: {
          room: {
            id: id,
          },
          category: {
            id: createCategoryDto.id,
          },
        },
      });

      if (existingPivot !== undefined) throw new BadRequestException();

      let pivot: Pivot = new Pivot();
      pivot.category = category;
      pivot.room = room;
      pivot.weight = createCategoryDto.weight;

      pivot = await this.pivotsRepository.save(pivot);
      return pivot;
    } else {
      throw new UnauthorizedException();
    }
  }

  public async findAllCategories() {
    const categories = await this.categoriesRepository.find();
    return categories;
  }

  public async findAll(id: number, user: User) {
    const requester = await this.usersRepository.findOne({ email: user.email });
    const room = await this.roomsRepository.findOne({
      relations: ['creator'],
      where: { id: id },
    });

    if (room === undefined) throw new NotFoundException();
    if (requester.id === room.creator.id) {
      const pivot = await this.pivotsRepository.find({
        where: {
          room: {
            id: id,
          },
        },
        relations: ['category'],
      });

      return pivot;
    }

    return new NotFoundException();
  }

  public async deleteCategory(roomId: number, pivotId: number, user: User) {
    const requester = await this.usersRepository.findOne({ email: user.email });
    const room = await this.roomsRepository.findOne({
      relations: ['creator'],
      where: { id: roomId },
    });

    if (room === undefined) throw new NotFoundException();
    if (requester.id === room.creator.id) {
      let existingPivot = await this.pivotsRepository.findOne({
        where: {
          id: pivotId,
        },
      });

      if (existingPivot === undefined) throw new BadRequestException();

      existingPivot = await this.pivotsRepository.remove(existingPivot);
    } else {
      throw new UnauthorizedException();
    }
    return new DeleteResult();
  }
}
