import { Controller, Post, UseGuards, Request, Body, ValidationPipe, UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { User } from '../users/entities/user.entity';
import { AuthService } from './auth.service';
import { LoginRequestDto } from './dto/login-request.dto';


@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}


  @Post('login')
  @UseInterceptors(ClassSerializerInterceptor)
  async login(@Body(ValidationPipe) loginRequestDto: LoginRequestDto): Promise<string> {
    return await this.authService.login(loginRequestDto);
  }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto): Promise<string> {
    return await this.authService.register(createUserDto);
  }
}
