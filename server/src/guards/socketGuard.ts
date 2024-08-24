import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { SocketCustom } from 'src/models';
import { UserService } from 'src/user/user.service';

@Injectable()
export class SocketGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const socket: SocketCustom = context.switchToWs().getClient<SocketCustom>();
    const token = context.switchToWs().getClient().handshake.auth.token;

    if (!token) throw new WsException('no token');

    const decodedToken = this.jwtService.verify(token);
    const user = await this.userService.getUserById(decodedToken.id);
    if (!user) throw new WsException('no user');

    socket.user = user;

    return true;
  }
}
