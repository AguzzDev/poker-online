import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { SocketCustom, UserRoleEnum } from 'src/models';
import { UserService } from 'src/user/user.service';

@Injectable()
export class CreatorGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async canActivate(context: any): Promise<boolean> {
    if (context.contextType === 'ws') {
      return this.validateWebSocket(context);
    } else if (context.contextType === 'http') {
      return this.validateHttpRequest(context);
    }
    return false;
  }

  private async validateToken(token: string): Promise<boolean> {
    if (!token) {
      throw new UnauthorizedException('No token');
    }

    const decodedToken = this.jwtService.verify(token);
    const user = await this.userService.getUserById(decodedToken.id);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (user.role !== UserRoleEnum.creator) {
      throw new UnauthorizedException('Not the expected role');
    }

    return true;
  }

  private async validateWebSocket(context: ExecutionContext): Promise<boolean> {
    const socket: SocketCustom = context.switchToWs().getClient<SocketCustom>();
    const token = socket.handshake.auth.token;

    try {
      await this.validateToken(token);
      return true;
    } catch (error) {
      throw new WsException('Unauthorized');
    }
  }

  private async validateHttpRequest(
    context: ExecutionContext,
  ): Promise<boolean> {
    const token = context.switchToHttp().getRequest().headers.token;

    try {
      return await this.validateToken(token);
    } catch (error) {
      throw new UnauthorizedException('Unauthorized');
    }
  }
}
