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
import { AdminGuard } from 'src/guards/adminGuard';
import { CreatorGuard } from 'src/guards/creatorGuard';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class GameGateway implements OnModuleInit {
  constructor(private gameService: GameService) {}

  @WebSocketServer() io: Server;

  onModuleInit() {
    this.io.on('connection', async (socket: SocketCustom) => {
      const { sockets } = this.io.sockets;

      this.io.emit(EVENTS.SERVER.ALL_PLAYERS, sockets.size);

      socket.on('disconnect', () => {
        this.gameService.leaveRoomOrDisconnect({
          server: this.io,
          socket,
        });
        socket.leave(socket.id);
        this.io.emit(EVENTS.SERVER.ALL_PLAYERS, sockets.size);
      });
    });
  }

  @SubscribeMessage(EVENTS.CLIENT.CREATE_ROOM)
  @UseGuards(CreatorGuard)
  a(@MessageBody() values: CreateRoomDto) {
    return this.gameService.createRoom({ values, server: this.io });
  }

  @SubscribeMessage(EVENTS.CLIENT.DELETE_ROOM)
  @UseGuards(AdminGuard)
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

  @SubscribeMessage(EVENTS.CLIENT.PLAYER_CHIPS)
  @UseGuards(SocketGuard)
  j(@ConnectedSocket() socket: SocketCustom) {
    this.gameService.getMyChips({ id: socket.user._id, socket });
  }
}
