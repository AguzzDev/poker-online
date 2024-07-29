import { Injectable, InternalServerErrorException } from '@nestjs/common';

import {
  ConnectRoomArgs,
  ContinueGameArgs,
  CreateRoomArgs,
  PlayerTurnArgs,
  SetAutoBlindArgs,
  TakeSitArgs,
  LeaveRoomOrDisconnectArgs,
  NewMessageArgs,
  ShuffleArgs,
  PlayersRebuyChipsArgs,
  InitialRoundArgs,
  AdvancedRoundArgs,
  ClearPlayerMoveArgs,
  StartGameArgs,
  DeleteRoomArgs,
  GetMyChipsArgs,
  PlayerRebuyChipsArgs,
} from 'src/models';
import { PlayerActionDto } from 'src/dto';
import { GameMethodsService } from './game-methods.service';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class GameService {
  constructor(private GameMethodsService: GameMethodsService) {}

  public players = [];

  clientConnected(id: string, socket) {
    socket.join(id);
  }

  clientDisconnected(id: string) {
    this.players = this.players.filter((playerId) => playerId !== id);
  }

  getUsersOnline() {
    return this.players.length;
  }

  async createRoom({ values, server }: CreateRoomArgs) {
    try {
      await this.GameMethodsService.createRoom({ values, server });
    } catch (error) {
      throw new WsException('Error creating room');
    }
  }

  async deleteRoom({ roomId, server }: DeleteRoomArgs) {
    try {
      await this.GameMethodsService.deleteRoom({ roomId, server });
    } catch (error) {
      throw new WsException('Error deleting room');
    }
  }

  async connectRoom({ values, socket, server }: ConnectRoomArgs) {
    try {
      const { room, roomId } = await this.GameMethodsService.connectRoom({
        values,
        socket,
        server,
      });
      
      return { room, roomId };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async takeSit({ values, socket, server }: TakeSitArgs) {
    try {
      const { room, roomId, player } = await this.GameMethodsService.takeSit({
        values,
        socket,
        server,
      });

      return { room, roomId, player, error: false };
    } catch (error) {
      return { error: error.message };
    }
  }

  async newMessage({ values, server, socket }: NewMessageArgs) {
    try {
      return await this.GameMethodsService.newMessage({
        values,
        server,
        socket,
      });
    } catch (error) {
      return { error: error.message };
    }
  }

  async playerRebuyChips(values: PlayerRebuyChipsArgs) {
    await this.GameMethodsService.playerRebuyChips(values);
  }

  async leaveRoomOrDisconnect({ server, socket }: LeaveRoomOrDisconnectArgs) {
    await this.GameMethodsService.leaveRoomOrDisconnect({
      server,
      socket,
    });
  }

  async shuffle({ roomId, cards }: ShuffleArgs) {
    await this.GameMethodsService.shuffle({ roomId, cards });
  }

  async dealCardsPlayer(roomId: string) {
    await this.GameMethodsService.dealCardsPlayer(roomId);
  }

  async dealCardsDealer(roomId: string) {
    await this.GameMethodsService.dealCardsDealer(roomId);
  }

  async playersRebuyChips({ roomId, server, players }: PlayersRebuyChipsArgs) {
    await this.GameMethodsService.playersRebuyChips({
      roomId,
      server,
      players,
    });
  }

  async initialRound({ roomId, room, server, playerPos }: InitialRoundArgs) {
    await this.GameMethodsService.initialRound({
      roomId,
      room,
      server,
      playerPos,
    });
  }

  async advancedRound({ roomId, type, server }: AdvancedRoundArgs) {
    await this.GameMethodsService.advancedRound({ roomId, type, server });
  }

  async shouldContinueGame({
    room,
    roomId,
    server,
    player,
    round,
  }: ContinueGameArgs) {
    await this.GameMethodsService.shouldContinueGame({
      room,
      roomId,
      server,
      player,
      round,
    });
  }

  async startGame({ roomId, server }: StartGameArgs) {
    await this.GameMethodsService.startGame({ roomId, server });
  }

  async playTurn({ roomId, player, server, bidToPay }: PlayerTurnArgs) {
    await this.GameMethodsService.playTurn({
      roomId,
      player,
      server,
      bidToPay,
    });
  }

  async setPlayerMove(values: PlayerActionDto) {
    await this.GameMethodsService.setPlayerMove(values);
  }

  async clearPlayerMove({ roomId, userId }: ClearPlayerMoveArgs) {
    await this.GameMethodsService.clearPlayerMove({ roomId, userId });
  }

  async stopGame(roomId: string) {
    await this.GameMethodsService.stopGame(roomId);
  }

  async endGame(roomId: string) {
    await this.GameMethodsService.endGame(roomId);
  }

  async endRound(roomId: string) {
    await this.GameMethodsService.endRound(roomId);
  }

  async setAutoBlind({ roomId, x, blind, players }: SetAutoBlindArgs) {
    await this.GameMethodsService.setAutoBlind({ roomId, x, blind, players });
  }

  async determinateWinner(roomId: string) {
    await this.GameMethodsService.determinateWinner(roomId);
  }

  async getMyChips({ id, socket }: GetMyChipsArgs) {
    await this.GameMethodsService.getMyChips({ id, socket });
  }
}
