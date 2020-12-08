import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UnauthorizedException, Injectable } from '@nestjs/common';

import { Connection, Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { JwtPayload } from './dto/jwt-payload.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private connection: Connection,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.SECRET,
      ignoreExpiration: false,
    });
  }

  async validate(payload: any): Promise<User> {
    const email = payload.email;
    const user = await this.connection
      .getRepository(User)
      .createQueryBuilder('user')
      .where('user.email = :email', { email })

      .getOne();

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
