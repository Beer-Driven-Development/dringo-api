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
import * as argon2 from 'argon2';
import { OAuth2Client } from 'google-auth-library';
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const facebookClient = new OAuth2Client(process.env.FACEBOOK_APP_ID);

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(email);
    if (user && (await user.validatePassword(pass))) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  login(user: User): string {
    const email = user.email;
    const payload = { user };
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

      user.password = await this.hashPassword(createUserDto.password);
      user.username = createUserDto.username;

      const updateResult = await this.usersRepository.update(
        { email: user.email },
        user,
      );

      const token = await this.jwtService.signAsync({
        email: user.email,
        id: user.id,
        username: user.username,
      });

      return token;
    } else {
      user = new User();

      user.email = createUserDto.email;
      user.username = createUserDto.username;
      user.password = await this.hashPassword(createUserDto.password);

      user = await this.usersRepository.save(user);
      const token = await this.jwtService.signAsync({
        email: user.email,
        id: user.id,
        username: user.username,
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

  // private async verifyGoogleToken(token: string) {
  //   const ticket = await googleClient.verifyIdToken({
  //     idToken: token,
  //     audience: process.env.GOOGLE_CLIENT_ID,
  //   });
  //   const payload = ticket.getPayload();
  //   const email = payload['email'];
  //   return email;
  // }

  private async verifyFacebookToken(token: string) {
    const ticket = await facebookClient.verifyIdToken({
      idToken: token,
      audience: process.env.FACEBOOK_APP_ID,
    });
    const payload = ticket.getPayload();
    const email = payload['email'];
    return email;
  }

  public async findOrCreate(googleUser): Promise<string> {
    const email = googleUser.email;
    const user = await this.usersRepository.findOne({ email });

    if (user) {
      const accessToken = await this.jwtService.signAsync({
        id: user.id,
        email: user.email,
        username: user.username,
      });
      return accessToken;
    }

    let createdUser = new User();
    createdUser.email = email;
    createdUser = await this.usersRepository.save(createdUser);

    delete createdUser.password;

    const accessToken = await this.jwtService.signAsync({
      id: createdUser.id,
      email: createdUser.email,
      username: createdUser.username,
    });

    return accessToken;
  }

  public async findOrCreateByEmail(facebookUser): Promise<string> {
    const email = facebookUser;
    const user = await this.usersRepository.findOne({ email });

    if (user) {
      const accessToken = await this.jwtService.signAsync({
        id: user.id,
        email: user.email,
        username: user.username,
      });
      return accessToken;
    }

    let createdUser = new User();
    createdUser.email = email;
    createdUser = await this.usersRepository.save(createdUser);

    delete createdUser.password;

    const accessToken = await this.jwtService.signAsync({
      id: createdUser.id,
      email: createdUser.email,
      username: createdUser.username,
    });

    return accessToken;
  }

  public async hashPassword(password: string): Promise<string> {
    const hash = await argon2.hash(password, { type: argon2.argon2id });
    return hash;
  }
}
