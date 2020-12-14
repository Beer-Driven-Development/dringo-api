import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Beer } from 'src/beers/beer.entity';
import { CategoriesModule } from 'src/categories/categories.module';
import { CategoriesService } from 'src/categories/categories.service';
import { Category } from 'src/categories/category.entity';
import { Pivot } from 'src/categories/pivot.entity';
import { Rating } from '../ratings/rating.entity';
import { User } from '../users/entities/user.entity';
import { DegustationsService } from './degustation.service';
import { Room } from './entities/room.entity';
import { RoomsController } from './rooms.controller';
import { RoomsGateway } from './rooms.gateway';
import { RoomsService } from './rooms.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Room, User, Beer, Category, Pivot, Rating]),
    AuthModule,
    CategoriesModule,
  ],
  controllers: [RoomsController],
  providers: [
    RoomsService,
    RoomsGateway,
    CategoriesService,
    DegustationsService,
  ],
})
export class RoomsModule {}
