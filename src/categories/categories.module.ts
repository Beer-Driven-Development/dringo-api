import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { Category } from './category.entity';
import { Pivot } from './pivot.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { User } from 'src/users/entities/user.entity';
import { Room } from 'src/rooms/entities/room.entity';
import { RoomsService } from 'src/rooms/rooms.service';
import { Beer } from 'src/beers/beer.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Category, Pivot, User, Room, Beer]),
    AuthModule,
    CategoriesModule,
  ],
  providers: [CategoriesService, RoomsService],
  controllers: [CategoriesController],
})
export class CategoriesModule {}
