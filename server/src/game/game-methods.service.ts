import { Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import bcrypt from 'bcrypt';
import { EVENTS } from 'const';
import {
  AdvancedRoundArgs,
  ClearPlayerMoveArgs,
  ConnectRoomArgs,
  ContinueGameArgs,
  ContinueGameTypeEnum,
  CreateRoomArgs,
  DeleteRoomArgs,
  DeskTypesEnum,
  GameSoundTypesEnum,
  GetMyChipsArgs,
  InitialRoundArgs,
  LeaveRoomOrDisconnectArgs,
  NewMessageArgs,
  PlayerRebuyChipsArgs,
  PlayersRebuyChipsArgs,
  PlayerTurnArgs,
  PlayerTypesEnum,
  SetAutoBlindArgs,
  ShuffleArgs,
  StartGameArgs,
  Status,
  TakeSitArgs,
  UserInterface,
} from 'src/models';
import { RoomService } from 'src/room/room.service';
import { evaluateHand, getAllCards, getWinner } from 'src/utils/pokerUtils';
import { PlayerActionDto } from 'src/dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class GameMethodsService {
  constructor(
    private roomService: RoomService,
    private userService: UserService,
  ) {}

  async createRoom({ values, server }: CreateRoomArgs) {
    const room = await this.roomService.createRoom(values);

    server.emit(EVENTS.SERVER.ROOMS, { type: 'create', room });
  }

  async deleteRoom({ roomId, server }: DeleteRoomArgs) {
    const room = await this.roomService.deleteRoom(roomId);

    server.emit(EVENTS.SERVER.ROOMS, { type: 'delete', room });
    server.to(room._id.toString()).emit(EVENTS.SERVER.ROOM_STATUS, 'delete');
  }

  async connectRoom({ values, socket, server }: ConnectRoomArgs) {
    const { id, password } = values;
    const room = await this.roomService.findRoom(id);

    if (!room) {
      throw new WsException('Room not exist');
    }
    if (room?.password) {
      const compare = await bcrypt.compare(password, room.password);

      if (!compare) {
        throw new WsException('Password incorrect');
      }
    }
    const roomId = room._id.toString();
    socket.join(roomId);

    server.emit(EVENTS.SERVER.ROOMS, { type: 'update', room });
    server
      .to(roomId)
      .emit(
        EVENTS.SERVER.ROOM_MESSAGES,
        `${socket.user.username} entró a la mesa!`,
      );

    return { roomId, room };
  }

  async takeSit({ values, socket, server }: TakeSitArgs) {
    const { roomId, sit } = values;

    const room = await this.roomService.addPlayer({
      roomId,
      sit,
      socket,
    });

    const findMe = room.desk.players.filter(
      ({ userId }) => userId == socket.user._id,
    )[0];

    server.emit(EVENTS.SERVER.ROOMS, { type: 'update', room });
    server.to(roomId).emit(EVENTS.SERVER.PLAYERS_IN_ROOM, room.desk.players);

    return { room, roomId, player: findMe };
  }

  async newMessage({ values, server, socket }: NewMessageArgs) {
    const roomId = socket ? socket.user.lastRoomVisited : values.roomId;

    const message = await this.roomService.setMessage({
      roomId,
      message: {
        message: values.message,
        userId: socket ? socket.user._id : 'System',
      },
    });

    server.to(roomId).emit(EVENTS.SERVER.MESSAGE_SEND, message);
  }

  async leaveRoomOrDisconnect({ server, socket }: LeaveRoomOrDisconnectArgs) {
    const user = socket.user as UserInterface;
    if (!user) return;

    const rooms = await this.roomService.removePlayer(user._id.toString());
    if (!rooms) return;

    rooms.map(async (room) => {
      if (room.desk.players.length === 1) {
        await this.stopGame(room._id.toString());
      }

      server.emit(EVENTS.SERVER.ROOMS, { type: 'update', room });
      server.to(room._id.toString()).emit(EVENTS.SERVER.UPDATE_GAME, room.desk);
      server
        .to(room._id.toString())
        .emit(EVENTS.SERVER.PLAYERS_IN_ROOM, room.desk.players);
      server
        .to(room._id.toString())
        .emit(
          EVENTS.SERVER.ROOM_MESSAGES,
          `${user.username} salio de la sala!`,
        );
    });
  }

  async shuffle({ roomId, cards }: ShuffleArgs) {
    for (let i = 0; i < cards.length; i++) {
      const newIndex = Math.floor(Math.random() * (i + 1));
      const oldValue = cards[newIndex];
      cards[newIndex] = cards[i];
      cards[i] = oldValue;
    }

    await this.roomService.updateInDesk({ id: roomId, values: { cards } });
  }

  async dealCardsPlayer(roomId: string) {
    const room = await this.roomService.findRoom(roomId);

    const players = room.desk.players;

    const takeLastCard = async () => {
      await this.roomService.updateInDesk({
        id: roomId,
        type: DeskTypesEnum.takeCard,
      });

      return room.desk.cards[room.desk.cards.length - 1];
    };
    for (let x = 0; x < players.length; x++) {
      let playerCards = [];

      for (let i = 0; i < 2; i++) {
        playerCards.push(await takeLastCard());
      }

      await this.roomService.updateInPlayer({
        id: roomId,
        values: { userId: players[x].userId, cards: playerCards },
      });
    }
  }

  async dealCardsDealer(roomId: string) {
    const room = await this.roomService.findRoom(roomId);

    const dealer = room.desk.dealer;

    const takeLastCard = async () => {
      await this.roomService.updateInDesk({
        id: roomId,
        type: DeskTypesEnum.takeCard,
      });
      return room.desk.cards[room.desk.cards.length - 1];
    };

    if (dealer.length === 0) {
      let cards = [];
      for (let i = 0; i < 3; i++) {
        cards.push(await takeLastCard());
      }
      await this.roomService.updateInDesk({
        id: roomId,
        values: { cards },
        type: DeskTypesEnum.dealer,
      });
      return cards;
    }

    const cards = await takeLastCard();
    await this.roomService.updateInDesk({
      id: roomId,
      values: { cards: [cards] },
      type: DeskTypesEnum.dealer,
    });
    return cards;
  }

  async playersRebuyChips({ roomId, server, players }: PlayersRebuyChipsArgs) {
    server.to(roomId).emit(EVENTS.SERVER.ROOM_INFO, {
      message:
        players.length === 1
          ? `Esperando Rebuy de ${players[0].name}`
          : `Esperando Rebuy de (${players.length} jugadores)`,
      by: 'server',
    });
    server.to(roomId).emit(EVENTS.SERVER.PLAYER_REBUY, players);

    await new Promise((resolve) => setTimeout(resolve, 5000));
    const room = await this.roomService.findRoom(roomId);

    const playersEmptyChips = this.roomService.findPlayersEmptyChips(room);

    if (playersEmptyChips.length === 0) return room;

    for (const { userId } of playersEmptyChips) {
      await this.roomService.removePlayer(userId);
    }

    const updateRoom = await this.roomService.findRoom(roomId);
    if (updateRoom.desk.players.length === 1) {
      await this.stopGame(roomId);
    }
  }

  async initialRound({ roomId, room, server, playerPos }: InitialRoundArgs) {
    let cards = getAllCards();
    await this.shuffle({ roomId, cards });
    await this.dealCardsPlayer(roomId);
    await this.dealCardsDealer(roomId);
    await this.setAutoBlind({
      roomId,
      x: playerPos - 1,
      blind: room.desk.blind,
      players: room.desk.players,
    });

    server
      .to(roomId)
      .emit(EVENTS.SERVER.GAME_SOUND, GameSoundTypesEnum.shuffle);
  }

  async advancedRound({ roomId, type, server }: AdvancedRoundArgs) {
    if (type === ContinueGameTypeEnum.allIn) {
      await new Promise((resolve) => setTimeout(resolve, 1500));
    } else {
      await this.endRound(roomId);
    }
    const card = await this.dealCardsDealer(roomId);
    server.to(roomId).emit(EVENTS.SERVER.DEAL_CARDS, card);
    server.to(roomId).emit(EVENTS.SERVER.GAME_SOUND, GameSoundTypesEnum.deal);
  }

  async shouldContinueGame({
    room,
    roomId,
    server,
    player,
    round,
  }: ContinueGameArgs): Promise<{ type: ContinueGameTypeEnum; next: boolean }> {
    return new Promise(async (resolve) => {
      if (!room.start) {
        const roomUpdate = await this.stopGame(roomId);
        server.to(roomId).emit(EVENTS.SERVER.ROOM_INFO, {
          message: 'Esperando jugadores...',
          by: 'server',
        });
        server.to(roomId).emit(EVENTS.SERVER.UPDATE_GAME, roomUpdate.desk);

        resolve({ type: ContinueGameTypeEnum.break, next: false });
      } else {
        const playersInFold = room.desk.players.filter(
          ({ action }) => action === Status.fold,
        ).length;
        const playersAllIn = room.desk.players.filter(
          ({ action }) => action === Status.allIn,
        ).length;

        if (round === 1) {
          const playersEmptyChips =
            this.roomService.findPlayersEmptyChips(room);

          if (playersEmptyChips.length === 0)
            return resolve({ type: ContinueGameTypeEnum.continue, next: true });

          await this.playersRebuyChips({
            roomId,
            server,
            players: playersEmptyChips,
          });

          resolve(await this.shouldContinueGame({ room, roomId, server }));
        } else if (playersAllIn == room.desk.players.length) {
          resolve({ type: ContinueGameTypeEnum.allIn, next: false });
        } else if (playersInFold == room.desk.players.length - 1) {
          resolve({ type: ContinueGameTypeEnum.desk, next: false });
        } else if (player?.cards?.length === 0 || player?.action) {
          resolve({ type: ContinueGameTypeEnum.player, next: false });
        } else {
          resolve({ type: ContinueGameTypeEnum.continue, next: true });
        }
      }
    });
  }

  async startGame({ roomId, server }: StartGameArgs) {
    const room = await this.roomService.findRoom(roomId);

    if (!room.start) {
      let time = 5;
      const interval = setInterval(async () => {
        server.to(roomId).emit(EVENTS.SERVER.ROOM_INFO, {
          message: `El juego inicia en ${time}`,
          by: 'server',
        });
        time--;
        if (time == 0) {
          clearInterval(interval);
          await this.roomService.updateInRoom({
            id: room._id.toString(),
            values: { start: true },
          });

          this.initGame({ roomId, server });
        }
      }, 1000);
    }
  }

  async initGame({ roomId, server }: StartGameArgs) {
    let countRound = 1;
    let playerPos = 1;
    let endGame = false;
    let room;

    while (countRound <= 3) {
      let countPlayer = 1;
      let countPlayerTurn = playerPos + 1;

      room = await this.roomService.findRoom(roomId);
      const { next, type } = await this.shouldContinueGame({
        room,
        roomId,
        server,
        round: countRound,
      });

      if (!next) {
        if (type === ContinueGameTypeEnum.desk) {
          endGame = true;
        }
        if (type === ContinueGameTypeEnum.break) {
          break;
        }
      }

      if (!endGame) {
        room = await this.roomService.findRoom(roomId);
        await new Promise((resolve) => setTimeout(resolve, 1000));

        if (countRound == 1) {
          await this.initialRound({ room, roomId, playerPos, server });
        } else {
          await this.advancedRound({ roomId, server, type });
        }

        room = await this.roomService.findRoom(roomId);
        server.to(roomId).emit(EVENTS.SERVER.UPDATE_GAME, room.desk);

        while (countPlayer <= room.desk.players.length) {
          endGame = false;
          let currentPlayerIndex = countPlayerTurn % room.desk.players.length;
          let player = room.desk.players[currentPlayerIndex];

          const { next, type } = await this.shouldContinueGame({
            room,
            roomId,
            player,
            server,
          });
          if (!next) {
            if (
              type === ContinueGameTypeEnum.player ||
              type === ContinueGameTypeEnum.allIn
            ) {
              countPlayer++;
              countPlayerTurn++;
              continue;
            }
            if (type === ContinueGameTypeEnum.desk) {
              endGame = true;
              break;
            }
          }

          const playerAction = await this.playTurn({
            roomId,
            player,
            server,
            bidToPay: room.desk.bidToPay,
          });

          if (playerAction != Status.fold) {
            if (playerAction == Status.raise) {
              await this.clearPlayerMove({ roomId, userId: player.userId });
            }
            if (playerAction == Status.bid || playerAction == Status.raise) {
              countPlayer = room.desk.players.length - 1;
            } else {
              countPlayer++;
            }
          }

          server
            .to(roomId)
            .emit(EVENTS.SERVER.GAME_SOUND, GameSoundTypesEnum[playerAction]);

          const updateRoom = await this.roomService.findRoom(roomId);
          server.to(roomId).emit(EVENTS.SERVER.UPDATE_GAME, updateRoom.desk);

          countPlayerTurn++;
          continue;
        }
      }

      if (countRound == 3 || endGame) {
        const getWinner = await this.determinateWinner(roomId);

        server.to(roomId).emit(EVENTS.SERVER.GAME_WINNER, getWinner);

        await this.newMessage({
          values: { roomId, message: getWinner },
          server,
        });
        const room = await this.endGame(roomId);
        server.to(roomId).emit(EVENTS.SERVER.UPDATE_GAME, room.desk);

        if (playerPos >= room.desk.players.length) {
          playerPos = 1;
        } else {
          playerPos++;
        }

        endGame = false;
        countRound = 1;
      } else {
        countRound++;
      }
    }
  }

  async playTurn({
    roomId,
    player,
    server,
    bidToPay,
  }: PlayerTurnArgs): Promise<Status> {
    return new Promise((resolve) => {
      let timer = 10;

      server.to(roomId).emit(EVENTS.SERVER.ROOM_INFO, {
        message: `Turno de ${player.name}`,
        by: player.userId,
      });
      server.to(roomId).emit(EVENTS.SERVER.PLAYER_TURN, player.userId);

      const interval = setInterval(async () => {
        server.to(roomId).emit(EVENTS.SERVER.PLAYER_TIMER, timer);

        const playerResult = await this.roomService.findPlayerMove({
          roomId,
          userId: player.userId,
        });

        if (playerResult?.player?.action) {
          clearInterval(interval);
          resolve(playerResult.player.action);
        }

        if (timer <= 0) {
          const playerPayBid =
            player.bid >= bidToPay ? Status.check : Status.fold;

          const values = {
            roomId,
            userId: player.userId,
            action:
              playerResult.deskStatus == Status.bid ||
              playerResult.deskStatus == Status.raise ||
              playerResult.deskStatus == Status.allIn
                ? playerPayBid
                : Status.check,
          };

          await this.setPlayerMove(values);
          clearInterval(interval);
          resolve(values.action);
        }

        timer--;
      }, 1000);
    });
  }

  async setPlayerMove(values: PlayerActionDto) {
    const { roomId, userId, action, bid = 0 } = values;

    switch (action) {
      case Status.fold:
      case Status.check: {
        await this.roomService.updateInPlayer({
          id: roomId,
          values: {
            userId,
            action: Status[action],
            showAction: Status[action],
          },
        });
        break;
      }
      case Status.bid:
      case Status.raise:
      case Status.allIn: {
        await this.roomService.updateInDesk({
          id: roomId,
          values: {
            status: Status[action],
            bidToPay: bid,
            totalBid: bid,
          },
        });
        await this.roomService.updateInPlayer({
          id: roomId,
          values: {
            userId,
            action: Status[action],
            showAction: Status[action],
            chips: -bid,
            bid: bid,
          },
        });

        break;
      }
      case Status.call:
        await this.roomService.updateInDesk({
          id: roomId,
          values: {
            totalBid: bid,
          },
        });
        await this.roomService.updateInPlayer({
          id: roomId,
          values: {
            userId,
            action: Status[action],
            showAction: Status[action],
            chips: -bid,
            bid: bid,
          },
        });
    }
  }

  async clearPlayerMove({ roomId, userId }: ClearPlayerMoveArgs) {
    await this.roomService.updateInPlayer({
      id: roomId,
      values: { userId },
      type: PlayerTypesEnum.clearActions,
    });
  }

  async stopGame(roomId: string) {
    await this.roomService.updateInRoom({
      id: roomId,
      values: { start: false },
    });
    await this.roomService.updateInDesk({
      id: roomId,
      type: DeskTypesEnum.stop,
    });
    const room = await this.roomService.updateInPlayer({
      id: roomId,
      type: PlayerTypesEnum.stop,
    });
    return room;
  }

  async endGame(roomId: string) {
    await this.roomService.updateInDesk({
      id: roomId,
      type: DeskTypesEnum.reset,
    });
    return await this.roomService.updateInPlayer({
      id: roomId,
      type: PlayerTypesEnum.reset,
    });
  }

  async endRound(roomId: string) {
    await this.roomService.updateInDesk({
      id: roomId,
      values: { status: null, bidToPay: 0 },
    });

    return await this.roomService.updateInPlayer({
      id: roomId,
      type: PlayerTypesEnum.endRound,
    });
  }

  async setAutoBlind({ roomId, x, blind, players }: SetAutoBlindArgs) {
    const playerBlind = !players[x] ? players[0] : players[x];
    const playerAutoBlind = !players[x + 1] ? players[0] : players[x + 1];

    const playerBlindValues = {
      userId: playerBlind.userId,
      blind: true,
    };

    const playerAutoBlindValues = {
      userId: playerAutoBlind.userId,
      bid: blind,
      chips: -blind,
    };

    await this.roomService.updateInDesk({
      id: roomId,
      values: {
        status: Status.bid,
        bidToPay: blind,
        totalBid: blind,
      },
    });
    await this.roomService.updateInPlayer({
      id: roomId,
      values: playerBlindValues,
    });
    await this.roomService.updateInPlayer({
      id: roomId,
      values: playerAutoBlindValues,
    });
  }

  async determinateWinner(roomId: string) {
    let playerHands = [];
    const room = await this.roomService.findRoom(roomId);

    const filterPlayersInGame = room.desk.players.filter(
      ({ cards }) => cards.length > 0,
    );
    const playersInGame = filterPlayersInGame.filter(
      ({ action }) => action !== Status.fold,
    );

    if (playersInGame.length === 0) return;

    playersInGame.forEach((player) => {
      const evaluate = evaluateHand({
        cards: room.desk.dealer,
        player,
      });

      playerHands.push({
        _id: player.userId.toString(),
        name: player.name,
        ...evaluate,
      });
    });

    const playerWinners = getWinner(playerHands);

    if (playerWinners.usersId.length === 1) {
      await this.roomService.updatePlayerChips({
        roomId,
        userId: playerWinners.usersId[0],
        chips: room.desk.totalBid,
      });
      return playerWinners.message;
    }

    playerWinners.usersId.forEach(async (userId) => {
      await this.roomService.updatePlayerChips({
        roomId,
        userId,
        chips: room.desk.totalBid / playerWinners.usersId.length,
      });
    });
  }

  async playerRebuyChips(values: PlayerRebuyChipsArgs) {
    const findPlayer = await this.userService.getUserById(values.userId);
    if (!findPlayer) throw new WsException('Jugador no encontrado');
    if (findPlayer.chips < values.chips)
      throw new WsException('No tenes las fichas suficientes');

    await this.roomService.updatePlayerChips(values);
  }

  async getMyChips({ id, socket }: GetMyChipsArgs) {
    const { chips } = await this.userService.getUserById(id);
    socket.emit(EVENTS.SERVER.PLAYER_CHIPS, chips);
  }
}
