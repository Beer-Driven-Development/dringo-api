import { Controller, Post, UseGuards, Request, Body } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { User } from '../users/entities/user.entity';
import { AuthService } from './auth.service';
import { LoginRequestDto } from './dto/login-request.dto';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() loginRequestDto: LoginRequestDto): Promise<string> {
    return await this.authService.login(loginRequestDto);
  }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto): Promise<string> {
    return await this.authService.register(createUserDto);
  }
}
