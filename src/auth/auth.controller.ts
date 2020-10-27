import {
  Controller,
  Post,
  UseGuards,
  Request,
  Body,
  ValidationPipe,
  UseInterceptors,
  ClassSerializerInterceptor,
  Get,
  Req,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { User } from '../users/entities/user.entity';
import { AuthService } from './auth.service';
import { LoginRequestDto } from './dto/login-request.dto';
import { REQUEST } from '@nestjs/core';
import { GetUser } from 'src/users/user.decorator';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(LocalAuthGuard)
  login(@Request() req): string {
    return this.authService.login(req.user);
  }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto): Promise<string> {
    return await this.authService.register(createUserDto);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {}

  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req) {
    return this.authService.googleLogin(req);
  }

  @Get('facebook')
  @UseGuards(AuthGuard('facebook'))
  async facebookLogin(): Promise<any> {
    return HttpStatus.OK;
  }

  @Get('facebook/redirect')
  @UseGuards(AuthGuard('facebook'))
  @UseInterceptors(ClassSerializerInterceptor)
  async facebookLoginRedirect(
    @Req() req: Request,
    @GetUser() user,
  ): Promise<any> {
    return user;
  }
}
