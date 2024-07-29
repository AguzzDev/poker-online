import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { SocketCustom, UserRoleEnum } from 'src/models';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AdminGuard implements CanActivate {
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
      if (!token) throw new WsException('no token');

      const decodedToken = this.jwtService.verify(token);
      const user = await this.userService.getUserById(decodedToken.id);

      if (user.role == UserRoleEnum.user) throw new WsException('not the expected role');

      socket.user = user;
      
      return true;
    } catch (error) {
      throw new WsException('Error');
    }
  }
}