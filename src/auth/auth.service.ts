import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { LoginRequestDto } from './dto/login-request.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (user && user.validatePassword(pass)) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  async login(loginRequestDto: LoginRequestDto) {
    const email = await this.validatePassword(loginRequestDto);
    console.log('login()');
    console.log(email);
    if (!email) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email };
    const accessToken = this.jwtService.sign(payload);
    return accessToken;
  }

  async register(createUserDto: CreateUserDto): Promise<string> {
    let user = await this.usersRepository.findOne({
      email: createUserDto.email,
    });

    if (user) {
      if (user.username != null)
        throw new BadRequestException('User already exists');

      const salt = await bcrypt.genSalt();
      user.salt = salt;
      user.password = await this.hashPassword(createUserDto.password, salt);
      user.username = createUserDto.username;

      const updateResult = await this.usersRepository.update(
        { email: user.email },
        user,
      );

      const token = await this.jwtService.signAsync({
        email: user.email,
        password: user.password,
      });

      return token;
    } else {
      user = new User();

      user.email = createUserDto.email;
      user.username = createUserDto.username;
      const salt = await bcrypt.genSalt();
      user.salt = salt;
      user.password = await this.hashPassword(createUserDto.password, salt);

      user = await this.usersRepository.save(user);
      const token = await this.jwtService.signAsync({
        email: user.email,
        password: user.password,
      });
      return token;
    }
  }

  googleLogin(req) {
    if (!req.user) {
      return 'No user from google';
    }

    return req.user;
  }

  public async findOrCreate(profile): Promise<User> {
    const user = await this.usersRepository.findOne({ email: profile.email });

    if (user) return user;

    let createdUser = new User();
    createdUser.email = profile.email;
    createdUser = await this.usersRepository.save(createdUser);

    delete createdUser.password;
    delete createdUser.salt;
    delete createdUser.username;
    delete createdUser.id;

    return createdUser;
  }

  public async hashPassword(password: string, salt: string): Promise<string> {
    return await bcrypt.hash(password, salt);
  }

  async validatePassword(loginRequestDto: LoginRequestDto): Promise<string> {
    const { email, password } = loginRequestDto;
    const user = await this.usersRepository.findOne({ email });

    if (!user || !(await user.validatePassword(password))) {
      return null;
    }

    console.log(user.email);
    return user.email;
  }
}
