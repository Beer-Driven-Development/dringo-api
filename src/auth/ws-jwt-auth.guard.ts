import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
/*
    Custom imports for AuthService, jwt secret, etc...
*/
import * as jwt from 'jsonwebtoken';
import { User } from 'src/users/entities/user.entity';
import { AuthService } from './auth.service';
import { JwtPayload } from './dto/jwt-payload.dto';
import { LoginRequestDto } from './dto/login-request.dto';

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext) {
    const client = context.switchToWs().getClient();
    const headers: string[] = client.handshake.headers.split('; ');
    const authToken = headers
      .find(header => header.startsWith('jwt'))
      .split('=')[1];
    const credentials: LoginRequestDto = <LoginRequestDto>(
      jwt.verify(authToken, process.env.SECRET)
    );
    const user: User = await this.authService.validateUser(
      credentials.email,
      credentials.password,
    );
    // Bonus if you need to access your user after the guard
    context.switchToWs().getData().user = user;
    return Boolean(user);
  }
}
