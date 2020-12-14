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
import { DegustationsService } from './degustation.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { StartDto } from './dto/start.dto';
import { VoteDto } from './dto/vote.dto';
import { RoomsService } from './rooms.service';

@Controller('rooms')
export class RoomsController {
  constructor(
    private roomsService: RoomsService,
    private categoriesService: CategoriesService,
    private degustationsService: DegustationsService,
  ) {}

  @UseGuards(new JwtAuthGuard())
  @Post()
  public async create(@Body() createRoomDto: CreateRoomDto, @GetUser() user) {
    return await this.roomsService.create(createRoomDto, user);
  }

  @UseGuards(new JwtAuthGuard())
  @Post(':id/start')
  public async start(
    @Param('id') id: number,
    @Body() startDto: StartDto,
    @GetUser() user,
  ) {
    return await this.degustationsService.start(id, startDto, user);
  }

  @UseGuards(new JwtAuthGuard())
  @Post(':id/vote')
  public async vote(
    @Param('id') roomId: number,
    @Body() voteDto: VoteDto,
    @GetUser() user,
  ) {
    return await this.degustationsService.vote(roomId, voteDto, user);
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
  @Post(':id')
  public async changeStatus(@Param('id') id: number, @GetUser() user) {
    return await this.roomsService.changeStatus(id, user);
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
