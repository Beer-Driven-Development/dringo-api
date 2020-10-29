import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
/*
    Custom imports for AuthService, jwt secret, etc...
*/
import * as jwt from 'jsonwebtoken';
import { User } from 'src/users/entities/user.entity';
import { Connection } from 'typeorm';
import { AuthService } from './auth.service';
import { JwtPayload } from './dto/jwt-payload.dto';
import { LoginRequestDto } from './dto/login-request.dto';

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private connection: Connection,
  ) {}

  async canActivate(context: ExecutionContext) {
    const client = context.switchToWs().getClient();
    const data = context.switchToWs().getData();

    const authToken = data[1].token;
    const credentials: JwtPayload = <JwtPayload>(
      jwt.verify(authToken, process.env.SECRET)
    );
    const user = await this.connection
      .getRepository(User)
      .createQueryBuilder('user')
      .where('user.email = :email', { email: credentials.email })
      .getOne();

    if (!user) {
      throw new UnauthorizedException();
    }
    // Bonus if you need to access your user after the guard
    context.switchToWs().getData().user = user;
    return Boolean(user);
  }
}
