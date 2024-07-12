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
    try {
      const socket: SocketCustom = context
        .switchToWs()
        .getClient<SocketCustom>();
      const token = context.switchToWs().getClient().handshake.auth.token;
      if (!token) throw new WsException('Error');

      const decodedToken = this.jwtService.verify(token);
      socket.user = await this.userService.getUserById(decodedToken.id);

      return true;
    } catch (error) {
      throw new WsException('Error');
    }
  }
}
