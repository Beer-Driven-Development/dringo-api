import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from 'src/rooms/entities/room.entity';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
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

    if (requester.id === room.creator.id) {
      const category = await this.categoriesRepository.findOne({
        id: createCategoryDto.id,
      });
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
}
