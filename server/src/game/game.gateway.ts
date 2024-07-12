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
import { RoomService } from 'src/room/room.service';
import {
  ConnectRoomDto,
  CreateRoomDto,
  PlayerActionDto,
  SendMessageDto,
  PlayerAddChipsDto,
  TakeSitDto,
} from 'src/dto';
import { UserService } from 'src/user/user.service';
import { AdminGuard } from 'src/guards/adminGuard';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class GameGateway implements OnModuleInit {
  constructor(
    private userService: UserService,
    private gameService: GameService,
    private roomService: RoomService,
  ) {}

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
  // @UseGuards(AdminGuard)
  a(@MessageBody() values: CreateRoomDto) {
    return this.gameService.createRoom({ values, server: this.io });
  }

  @SubscribeMessage(EVENTS.CLIENT.DELETE_ROOM)
  @UseGuards(AdminGuard)
  async ab(@MessageBody() id: string) {
    this.gameService.deleteRoom({ id, server: this.io });
  }

  @SubscribeMessage(EVENTS.CLIENT.CONNECT_ROOM)
  @UseGuards(SocketGuard)
  async b(
    @MessageBody() values: ConnectRoomDto,
    @ConnectedSocket() socket: SocketCustom,
  ) {
    try {
      const { room, roomId } = await this.gameService.connectRoom({
        values,
        socket,
        server: this.io,
      });

      return { room, roomId, error: false };
    } catch (error) {
      return { error: error.message };
    }
  }

  @SubscribeMessage(EVENTS.CLIENT.TAKE_SIT)
  @UseGuards(SocketGuard)
  async c(
    @MessageBody() values: TakeSitDto,
    @ConnectedSocket() socket: SocketCustom,
  ) {
    try {
      const { room, roomId, player } = await this.gameService.takeSit({
        values,
        socket,
        server: this.io,
      });

      return { room, roomId, player, error: false };
    } catch (error) {
      return { error: error.message };
    }
  }

  @SubscribeMessage(EVENTS.CLIENT.MESSAGE)
  @UseGuards(SocketGuard)
  async d(
    @MessageBody() values: SendMessageDto,
    @ConnectedSocket() socket: SocketCustom,
  ) {
    try {
      return await this.gameService.newMessage({
        values,
        server: this.io,
        socket,
      });
    } catch (error) {
      return { error };
    }
  }

  @SubscribeMessage(EVENTS.CLIENT.LEAVE_ROOM)
  @UseGuards(SocketGuard)
  e(@ConnectedSocket() socket: SocketCustom) {
    return this.gameService.leaveRoomOrDisconnect({
      server: this.io,
      socket,
    });
  }

  @SubscribeMessage(EVENTS.CLIENT.START_GAME)
  @UseGuards(SocketGuard)
  async f(@MessageBody() id: string) {
    const room = await this.roomService.findRoom(id);
    const roomId = room._id.toString();

    if (!room.start) {
      let time = 5;
      const interval = setInterval(async () => {
        this.io
          .to(roomId)
          .emit(EVENTS.SERVER.ROOM_INFO, {
            message: `El juego inicia en ${time}`,
            by: 'server',
          });
        time--;
        if (time == 0) {
          clearInterval(interval);
          await this.roomService.updateInRoom({ id, values: { start: true } });

          this.gameService.startGame({ roomId, server: this.io });
        }
      }, 1000);
    }
  }

  @SubscribeMessage(EVENTS.CLIENT.PLAYER_ACTION)
  @UseGuards(SocketGuard)
  async g(@MessageBody() values: PlayerActionDto) {
    await this.gameService.setPlayerMove(values);
  }

  @SubscribeMessage(EVENTS.CLIENT.PLAYER_REBUY)
  @UseGuards(SocketGuard)
  async h(@MessageBody() values: PlayerAddChipsDto) {
    const findPlayer = await this.userService.getUserById(values.userId);
    if (!findPlayer) return { err: true, message: 'Jugador no encontrado' };
    if (findPlayer.chips < values.chips)
      return { err: true, message: 'No tenes las fichas suficientes' };

    await this.roomService.updatePlayerChips(values);

    return { err: false, message: 'Fichas agregadas' };
  }

  @SubscribeMessage(EVENTS.CLIENT.PLAYER_CHIPS)
  @UseGuards(SocketGuard)
  async i(@ConnectedSocket() socket: SocketCustom) {
    const { chips } = await this.userService.getUserById(socket.user._id);
    socket.emit(EVENTS.SERVER.PLAYER_CHIPS, chips);
  }
}
