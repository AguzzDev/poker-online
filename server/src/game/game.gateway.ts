import { OnModuleInit, UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

import { GameService } from './game.service';
import { EVENTS } from 'const';
import { SocketCustom } from 'src/models';
import { SocketGuard } from 'src/guards/socketGuard';
import {
  ConnectRoomDto,
  CreateRoomDto,
  PlayerActionDto,
  SendMessageDto,
  PlayerAddChipsDto,
  TakeSitDto,
} from 'src/dto';
import { CreatorGuard } from 'src/guards/creatorGuard';
import { UserService } from 'src/user/user.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class GameGateway implements OnModuleInit {
  constructor(
    private gameService: GameService,
    private userService: UserService,
  ) {}

  @WebSocketServer() io: Server;

  onModuleInit() {
    const users = [];
    this.io.on('connection', async (socket: SocketCustom) => {
      const token = socket.handshake.auth.token;

      users.push(token);

      this.io.emit(EVENTS.SERVER.ALL_PLAYERS, users.length);

      socket.on('disconnect', () => {
        this.gameService.leaveRoomOrDisconnect({
          server: this.io,
          socket,
        });
        socket.leave(socket.id);

        const index = users.indexOf(token);
        if (index !== -1) {
          users.splice(index, 1);
        }

        this.io.emit(EVENTS.SERVER.ALL_PLAYERS, users.length);
      });
    });
  }

  @SubscribeMessage(EVENTS.CLIENT.CREATE_ROOM)
  @UseGuards(CreatorGuard)
  a(@MessageBody() values: CreateRoomDto) {
    return this.gameService.createRoom({ values, server: this.io });
  }

  @SubscribeMessage(EVENTS.CLIENT.DELETE_ROOM)
  @UseGuards(CreatorGuard)
  b(@MessageBody() roomId: string) {
    this.gameService.deleteRoom({ roomId, server: this.io });
  }

  @SubscribeMessage(EVENTS.CLIENT.CONNECT_ROOM)
  @UseGuards(SocketGuard)
  c(
    @MessageBody() values: ConnectRoomDto,
    @ConnectedSocket() socket: SocketCustom,
  ) {
    return this.gameService.connectRoom({ values, socket, server: this.io });
  }

  @SubscribeMessage(EVENTS.CLIENT.TAKE_SIT)
  @UseGuards(SocketGuard)
  d(
    @MessageBody() values: TakeSitDto,
    @ConnectedSocket() socket: SocketCustom,
  ) {
    return this.gameService.takeSit({ values, socket, server: this.io });
  }

  @SubscribeMessage(EVENTS.CLIENT.MESSAGE)
  @UseGuards(SocketGuard)
  e(
    @MessageBody() values: SendMessageDto,
    @ConnectedSocket() socket: SocketCustom,
  ) {
    return this.gameService.newMessage({ values, server: this.io, socket });
  }

  @SubscribeMessage(EVENTS.CLIENT.LEAVE_ROOM)
  @UseGuards(SocketGuard)
  f(@ConnectedSocket() socket: SocketCustom) {
    this.gameService.leaveRoomOrDisconnect({
      server: this.io,
      socket,
    });
  }

  @SubscribeMessage(EVENTS.CLIENT.START_GAME)
  @UseGuards(SocketGuard)
  g(@MessageBody() id: string) {
    this.gameService.startGame({ roomId: id, server: this.io });
  }

  @SubscribeMessage(EVENTS.CLIENT.PLAYER_ACTION)
  @UseGuards(SocketGuard)
  h(@MessageBody() values: PlayerActionDto) {
    this.gameService.setPlayerMove(values);
  }

  @SubscribeMessage(EVENTS.CLIENT.PLAYER_REBUY)
  @UseGuards(SocketGuard)
  i(@MessageBody() values: PlayerAddChipsDto) {
    return this.gameService.playerRebuyChips(values);
  }

  @SubscribeMessage(EVENTS.CLIENT.UPDATE_USER)
  @UseGuards(SocketGuard)
  async j(@ConnectedSocket() socket: SocketCustom) {
    const user = await this.userService.getUserById(socket.user._id);
    return {
      chips: user.chips,
      matches: user.matches,
    };
  }

  @SubscribeMessage(EVENTS.CLIENT.GET_PLAYERS)
  @UseGuards(SocketGuard)
  async k(@ConnectedSocket() socket: SocketCustom) {
    const players = await Promise.all(
      socket.users.map(async (token) => {
        return await this.userService.getUserByToken(token);
      }),
    );
    return players;
  }
}
