import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from '../users/entities/user.entity';
import { GetUser } from '../users/user.decorator';
import { CreateRoomDto } from './dto/create-room.dto';
import { RoomsService } from './rooms.service';

@Controller('rooms')
export class RoomsController {
  constructor(private roomsService: RoomsService) {}

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
}
