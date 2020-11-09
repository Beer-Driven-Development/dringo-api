import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateBeerDto } from 'src/beers/dto/create-beer.dto';
import { CategoriesService } from 'src/categories/categories.service';
import { CreateCategoryDto } from 'src/categories/create-category.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from '../users/entities/user.entity';
import { GetUser } from '../users/user.decorator';
import { CreateRoomDto } from './dto/create-room.dto';
import { RoomsService } from './rooms.service';

@Controller('rooms')
export class RoomsController {
  constructor(
    private roomsService: RoomsService,
    private categoriesService: CategoriesService,
  ) {}

  @UseGuards(new JwtAuthGuard())
  @Post()
  public async create(@Body() createRoomDto: CreateRoomDto, @GetUser() user) {
    return await this.roomsService.create(createRoomDto, user);
  }

  @UseGuards(new JwtAuthGuard())
  @Delete(':id')
  public async delete(@Param('id') id: number, @GetUser() user) {
    return await this.roomsService.delete(id, user);
  }

  @UseGuards(new JwtAuthGuard())
  @Get()
  public async findAll() {
    return await this.roomsService.findAll();
  }

  @UseGuards(new JwtAuthGuard())
  @Post(':id/beers')
  public async addBeer(
    @Param('id') id: number,
    @Body() createBeerDto: CreateBeerDto,
    @GetUser() user: User,
  ) {
    return await this.roomsService.addBeer(id, createBeerDto, user);
  }

  @UseGuards(new JwtAuthGuard())
  @Get(':id/beers')
  public async findAllBeers(@Param('id') id: number) {
    return await this.roomsService.findAllBeers(id);
  }

  @UseGuards(new JwtAuthGuard())
  @Delete(':roomId/beers/:beerId')
  public async deleteBeer(
    @Param('roomId') roomId: number,
    @Param('beerId') beerId: number,
    @GetUser() user,
  ) {
    return await this.roomsService.deleteBeer(roomId, beerId, user);
  }

  @UseGuards(new JwtAuthGuard())
  @Post(':id/categories')
  public async addCategory(
    @Param('id') id: number,
    @Body() createCategoryDto: CreateCategoryDto,
    @GetUser() user: User,
  ) {
    return await this.categoriesService.add(id, createCategoryDto, user);
  }

  @UseGuards(new JwtAuthGuard())
  @Get(':id/categories')
  public async findAllCategories(
    @Param('id') id: number,
    @GetUser() user: User,
  ) {
    return await this.categoriesService.findAll(id, user);
  }

  @UseGuards(new JwtAuthGuard())
  @Delete(':roomId/categories/:pivotId')
  public async deleteCategory(
    @Param('roomId') roomId: number,
    @Param('pivotId') pivotId: number,
    @GetUser() user: User,
  ) {
    return await this.categoriesService.deleteCategory(roomId, pivotId, user);
  }
}
