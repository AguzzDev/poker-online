import { Injectable } from '@nestjs/common';
import { PlayerActionDto } from 'src/modules/common/dto';
import { UserService } from 'src/modules/user/user.service';
import { RoomService } from 'src/modules/room/room.service';
import { EVENTS } from 'const';
import {
  AdvancedRoundArgs,
  ClearPlayerMoveArgs,
  ConnectRoomArgs,
  ContinueGameArgs,
  CreateRoomArgs,
  DeleteRoomArgs,
  DeskTypesEnum,
  GameSoundTypesEnum,
  GameStatusEnum,
  InitialRoundArgs,
  NewMessageArgs,
  PlayerInterface,
  PlayerRebuyChipsArgs,
  PlayersRebuyChipsArgs,
  PlayerTurnArgs,
  PlayerTypesEnum,
  RoomInterface,
  SetAutoBlindArgs,
  ShuffleArgs,
  StartGameArgs,
  Status,
  TakeSitArgs,
  UserInterface,
  ErrorInterface,
  UserRoleEnum,
  LeaveRoomOrDisconnectArgs,
  CardInterface,
  MessageTypeEnum,
} from 'src/models';
import { evaluateHand, getAllCards, getWinner } from 'src/utils/pokerUtils';
import { findUserSocket } from 'src/utils/findPlayerSocket';
import { MissionService } from 'src/modules/mission/mission.service';

@Injectable()
export class GameService {
  constructor(
    private roomService: RoomService,
    private userService: UserService,
    private missionService: MissionService,
  ) {}

  public players = [];

  clientConnected(id: string, socket) {
    socket.join(id);
  }

  clientDisconnected(id: string) {
    this.players = this.players.filter((playerId) => playerId !== id);
  }

  getUsersOnline(): number {
    return this.players.length;
  }

  async createRoom({ values, server }: CreateRoomArgs) {
    const room = await this.roomService.createRoom(values);

    server.emit(EVENTS.SERVER.ROOMS, { type: 'create', room });
  }

  async deleteRoom({ roomId, server }: DeleteRoomArgs) {
    const room = await this.roomService.deleteRoom(roomId);

    server.emit(EVENTS.SERVER.ROOMS, { type: 'delete', room });
    server.to(room._id.toString()).emit(EVENTS.SERVER.ROOM_STATUS, 'delete');
  }

  async connectRoom({
    values,
    socket,
  }: ConnectRoomArgs): Promise<ErrorInterface | RoomInterface> {
    const { id } = values;
    const room = await this.roomService.findRoom(id);

    if (!room) {
      return { error: true, message: 'Room not exist' };
    }

    const roomId = room._id.toString();
    socket.join(roomId);

    return room;
  }

  async takeSit({
    values,
    socket,
    server,
  }: TakeSitArgs): Promise<
    ErrorInterface | { room: RoomInterface; player: PlayerInterface }
  > {
    const { roomId, sit } = values;

    const room = await this.roomService.addPlayer({
      roomId,
      sit,
      socket,
    });

    if ('error' in room) return room;

    const findMe = room.desk.players.filter(
      ({ userId }) => userId == socket.user._id,
    )[0];

    server.emit(EVENTS.SERVER.ROOMS, { type: 'update', room });
    server.to(roomId).emit(EVENTS.SERVER.UPDATE_GAME, room.desk);
    server.to(roomId).emit(EVENTS.SERVER.PLAYERS_IN_ROOM, room.players);
    server
      .to(roomId)
      .emit(
        EVENTS.SERVER.ROOM_NOTIFICATIONS,
        `${socket.user.username} entered the table!`,
      );

    return { room, player: findMe };
  }

  async newMessage({ values, server, socket }: NewMessageArgs) {
    const roomId = values.id;

    const room = await this.roomService.updateInMessages({
      id: roomId,
      values: {
        userId: socket ? socket.user._id : 'System',
        username: socket ? socket.user.username : 'System',
        message: values.message,
        image: socket ? socket.user.image : '',
        role: socket ? UserRoleEnum[socket.user.role] : '',
        timestamp: new Date(),
        cards: values.cards,
      },
      type: MessageTypeEnum.setMessage,
    });

    server
      .to(roomId)
      .emit(
        EVENTS.SERVER.MESSAGE_SEND,
        room.messages[room.messages.length - 1],
      );
  }

  async leaveRoomOrDisconnect({
    server,
    socket,
    spectator,
  }: LeaveRoomOrDisconnectArgs) {
    const user = socket.user as UserInterface;
    if (!user) return;

    const room = await this.roomService.removePlayer({
      id: socket.user._id.toString(),
      socket,
    });
    if (!room) return;

    const roomId = room._id.toString();

    server
      .to(roomId)
      .emit(
        EVENTS.SERVER.ROOM_NOTIFICATIONS,
        `${user.username} ${spectator ? 'stay as spectator!' : 'left the room!'}`,
      );

    if (room.start && room.desk.players.length === 1) {
      const player = room.desk.players[0];

      const targetSocket = await findUserSocket({
        sockets: server.sockets,
        userId: player.userId,
      });

      await this.userService.updateChips({
        id: player.userId,
        chips: player.bid + player.chips,
        socket: targetSocket,
      });

      await this.roomService.updateInMessages({
        id: roomId,
        type: MessageTypeEnum.deleteAll,
      });

      const roomUpdated = await this.stopGame(roomId);

      server.emit(EVENTS.SERVER.ROOMS, { type: 'update', room: roomUpdated });
      server.to(roomId).emit(EVENTS.SERVER.UPDATE_GAME, roomUpdated.desk);
      server
        .to(roomId)
        .emit(EVENTS.SERVER.PLAYERS_IN_ROOM, roomUpdated.players);
      server.to(roomId).emit(EVENTS.SERVER.ROOM_INFO, {
        message: 'Waiting players...',
        by: 'server',
      });
    } else {
      await this.roomService.updateInRoom({
        id: roomId,
        values: room,
      });

      server.emit(EVENTS.SERVER.ROOMS, { type: 'update', room });
      server.to(roomId).emit(EVENTS.SERVER.UPDATE_GAME, room.desk);
      server.to(roomId).emit(EVENTS.SERVER.PLAYERS_IN_ROOM, room.players);
    }
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

      return await this.roomService.updateInDesk({
        id: roomId,
        values: { cards },
        type: DeskTypesEnum.dealer,
      });
    }

    const cards = await takeLastCard();
    await this.roomService.updateInDesk({
      id: roomId,
      values: { cards: [cards] },
      type: DeskTypesEnum.dealer,
    });
  }

  async playersRebuyChips({ roomId, server, players }: PlayersRebuyChipsArgs) {
    const task = async () => {
      const room = await this.roomService.findRoom(roomId);

      const playersEmptyChips = this.roomService.findPlayersEmptyChips(room);
      if (playersEmptyChips.length === 0) return;

      for (const player of playersEmptyChips) {
        await this.roomService.removePlayer({ id: player.userId });
      }

      const updateRoom = await this.roomService.findRoom(roomId);
      if (updateRoom.desk.players.length === 1) {
        await this.stopGame(roomId);
      }
    };

    return new Promise((resolve) => {
      let rebuys = [];
      let timer = 10;

      server.to(roomId).emit(EVENTS.SERVER.ROOM_INFO, {
        message:
          players.length === 1
            ? `Waiting for ${players[0].username} Rebuy`
            : `Waiting for ${players.length}-player Rebuy)`,
        by: 'server',
      });
      server.to(roomId).emit(EVENTS.SERVER.PLAYER_REBUY, players);

      const interval = setInterval(async () => {
        players.map(async ({ userId }) => {
          const room = await this.roomService.findUserInRoom(userId);

          if (!room?.player) {
            clearInterval(interval);
            task();
            resolve(true);
            return;
          }

          if (room.player.chips > 0) {
            rebuys.push(true);
          }
        });

        if (rebuys.length > 0 && rebuys.every((values) => values === true)) {
          clearInterval(interval);
          task();
          resolve(true);
        }

        if (timer <= 0) {
          clearInterval(interval);
          task();
          resolve(true);
        }

        timer--;
      }, 1000);
    });
  }

  async initialRound({ roomId, room, server, playerPos }: InitialRoundArgs) {
    let cards = getAllCards();
    await this.shuffle({ roomId, cards });
    await this.dealCardsPlayer(roomId);
    await this.dealCardsDealer(roomId);
    if (room.desk.players.length > 2) {
      await this.setAutoBlind({
        roomId,
        x: playerPos,
        blind: room.desk.blind,
        players: room.desk.players,
      });
    }

    server
      .to(roomId)
      .emit(EVENTS.SERVER.GAME_SOUND, GameSoundTypesEnum.shuffle);
  }

  async advancedRound({ roomId, server }: AdvancedRoundArgs) {
    await this.dealCardsDealer(roomId);
    const room = await this.roomService.findRoom(roomId);
    const card = room.desk.cards[room.desk.cards.length - 1];

    server.to(roomId).emit(EVENTS.SERVER.DEAL_CARDS, card);
    server.to(roomId).emit(EVENTS.SERVER.GAME_SOUND, GameSoundTypesEnum.deal);
  }

  async shouldContinueGame({
    room,
    roomId,
    server,
    round,
  }: ContinueGameArgs): Promise<GameStatusEnum> {
    return new Promise(async (resolve) => {
      if (!room.start) {
        const roomUpdate = await this.stopGame(roomId);
        server.to(roomId).emit(EVENTS.SERVER.ROOM_INFO, {
          message: 'Waiting players...',
          by: 'server',
        });
        server.to(roomId).emit(EVENTS.SERVER.UPDATE_GAME, roomUpdate.desk);

        resolve(GameStatusEnum.stopGame);
      }

      const playersInFold = room.desk.players.filter(
        ({ action }) => action === Status.fold,
      ).length;
      const playersAllIn = room.desk.players.filter(
        ({ action }) => action === Status.allIn,
      ).length;

      if (round === 1) {
        const playersEmptyChips = this.roomService.findPlayersEmptyChips(room);

        if (playersEmptyChips.length === 0)
          return resolve(GameStatusEnum.continue);

        await this.playersRebuyChips({
          roomId,
          server,
          players: playersEmptyChips,
        });

        resolve(await this.shouldContinueGame({ room, roomId, server }));
      } else if (
        playersAllIn == room.desk.players.length ||
        room.desk.status === Status.allIn
      ) {
        resolve(GameStatusEnum.allIn);
      } else if (playersInFold == room.desk.players.length - 1) {
        resolve(GameStatusEnum.endGame);
      } else {
        resolve(GameStatusEnum.continue);
      }
    });
  }

  async initGame({ roomId, server }: StartGameArgs) {
    let roundNum = 1;
    let blindPos = 0;
    let stop = false;
    let gameStatus = GameStatusEnum.continue;
    let playersInGame;

    while (roundNum <= 3 && !stop) {
      let room = await this.roomService.findRoom(roomId);

      const response = await this.shouldContinueGame({
        roomId,
        room,
        server,
        round: roundNum,
      });

      gameStatus = GameStatusEnum[response];
      if (
        gameStatus === GameStatusEnum.stopGame ||
        gameStatus === GameStatusEnum.endGame
      ) {
        stop = true;
      }

      if (!stop) {
        if (roundNum === 1) {
          await this.initialRound({
            room,
            roomId,
            playerPos: blindPos,
            server,
          });
        } else {
          await this.advancedRound({ roomId, server });
        }

        playersInGame = room.desk.players.filter(
          ({ cards, action }) =>
            cards && action !== Status.fold && action !== Status.allIn,
        );

        playersInGame = playersInGame.length === 1 ? [] : playersInGame;

        if (blindPos !== room.desk.players.length - 1) {
          playersInGame = playersInGame.reverse();
        }

        server.to(roomId).emit(EVENTS.SERVER.UPDATE_GAME, room.desk);

        while (playersInGame.length > 0) {
          const player = playersInGame[0] as PlayerInterface;

          const response = await this.shouldContinueGame({
            room,
            roomId,
            player,
            server,
          });
          gameStatus = GameStatusEnum[response];

          if (gameStatus !== GameStatusEnum.continue) break;

          const playerAction = await this.playTurn({
            roomId,
            player,
            server,
            bidToPay: room.desk.bidToPay,
          });

          server.to(roomId).emit(EVENTS.SERVER.PLAYER_TURN, null);
          if (playerAction != Status.allIn && playerAction != Status.fold) {
            await this.clearPlayerMove({ roomId, userId: player.userId });
          }

          if (
            playerAction == Status.raise ||
            playerAction == Status.bid ||
            playerAction == Status.allIn
          ) {
            const activePlayers = room.desk.players.filter(
              ({ cards, action }) => cards && action !== Status.fold,
            );
            const num = activePlayers.findIndex(
              ({ sit }) => sit === player.sit,
            );

            const left = activePlayers.slice(0, num);
            const right = activePlayers.slice(num + 1);

            playersInGame = [...right, ...left];
          } else {
            playersInGame = playersInGame.splice(1);
          }

          server
            .to(roomId)
            .emit(EVENTS.SERVER.GAME_SOUND, GameSoundTypesEnum[playerAction]);
          server.to(roomId).emit(EVENTS.SERVER.UPDATE_GAME, room.desk);
        }
      }

      if (roundNum === 3 || stop) {
        if (playersInGame) {
          const getWinner = await this.determinateWinner(
            roomId,
            server.sockets,
          );

          if (!!getWinner) {
            await this.newMessage({
              values: {
                id: roomId,
                message: getWinner.message,
                cards: getWinner.cards,
              },
              server,
            });
          }

          await this.roomService.updateInPlayer({
            id: roomId,
            type: PlayerTypesEnum.clearBid,
          });

          server.to(roomId).emit(EVENTS.SERVER.UPDATE_GAME, room.desk);

          await new Promise((resolve) => setTimeout(resolve, 5000));
          await this.endGame(roomId);

          if (blindPos < room.desk.players.length - 1) {
            blindPos++;
          } else {
            blindPos = 0;
          }
        }

        if (gameStatus === GameStatusEnum.stopGame) {
          break;
        } else {
          stop = false;
        }

        roundNum = 1;
        gameStatus = GameStatusEnum.continue;
      } else {
        if (gameStatus === GameStatusEnum.allIn) {
          await new Promise((resolve) => setTimeout(resolve, 2000));
        } else {
          await new Promise((resolve) => setTimeout(resolve, 1500));
          await this.endRound(room._id.toString());
        }

        roundNum++;
      }
    }
  }

  async startGame({ roomId, server }: StartGameArgs) {
    const room = await this.roomService.findRoom(roomId);

    if (!room.start) {
      let time = 5;

      await this.roomService.updateInRoom({
        id: room._id.toString(),
        values: { start: true },
      });

      const interval = setInterval(async () => {
        server.to(roomId).emit(EVENTS.SERVER.ROOM_INFO, {
          message: `Game starts in ${time}`,
          by: 'server',
        });
        time--;
        if (time == 0) {
          clearInterval(interval);

          this.initGame({ roomId, server });
        }
      }, 1000);
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
        message: `${player.username} turn`,
        by: player.userId,
      });
      server.to(roomId).emit(EVENTS.SERVER.PLAYER_TURN, player.userId);

      const interval = setInterval(async () => {
        const playerResult = await this.roomService.findPlayerMove({
          roomId,
          userId: player.userId,
        });

        if (playerResult?.action) {
          clearInterval(interval);
          resolve(Status[playerResult.action]);
        }

        if (timer <= 0) {
          const playerPayBid =
            player.bid >= bidToPay ? Status.check : Status.fold;

          const values = {
            roomId,
            userId: player.userId,
            action: playerPayBid,
          };

          await this.setPlayerMove(values);
          clearInterval(interval);
          resolve(Status[values.action]);
        }

        timer--;
      }, 1000);
    });
  }

  async setPlayerMove(values: PlayerActionDto) {
    const {
      roomId,
      userId,
      action,
      bid = 0,
      totalBid = 0,
      bidToPay = 0,
    } = values;

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

        const room = await this.roomService.findRoom(roomId);
        const playersAllIn = room.desk.players.every(
          (players) => players.action === Status.allIn,
        );
        const deskStatus = room.desk.status;

        const newStatus = playersAllIn
          ? Status.allIn
          : !deskStatus
            ? Status.bid
            : Status.raise;

        await this.roomService.updateInDesk({
          id: roomId,
          values: {
            status: newStatus,
            bidToPay,
            totalBid,
          },
        });

        break;
      }
      case Status.call:
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

        const room = await this.roomService.findRoom(roomId);
        const playersAllIn = room.desk.players.some(
          (players) => players.action === Status.allIn,
        );

        const condition = room.desk.players.length === 2 && playersAllIn;
        await this.roomService.updateInDesk({
          id: roomId,
          values: {
            totalBid,
            status: condition ? Status.allIn : null,
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
      values: { start: false, players: 0 },
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
      type: PlayerTypesEnum.clearShowAction,
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

  async handOutChips({ roomId, playersArr, playerWinner, totalPot }) {
    let total = totalPot;

    const filterPlayersMoreChips = playersArr.filter(
      ({ bid }) => bid > playerWinner.bid,
    );

    if (filterPlayersMoreChips) {
      filterPlayersMoreChips.forEach(async (player) => {
        const diff = player.bid - playerWinner.bid;
        total -= diff;
        await this.roomService.updatePlayerChips({
          roomId,
          userId: player.userId,
          chips: diff,
        });
      });
    }

    return total;
  }

  async determinateWinner(
    roomId: string,
    sockets: any,
  ): Promise<{ message: string; cards: CardInterface[] | null }> {
    const room = await this.roomService.findRoom(roomId);

    let players = room.desk.players.filter(({ cards }) => cards.length > 0);
    if (players.length === 0) return;

    for (const player of players) {
      const evaluate = evaluateHand({
        cards: room.desk.dealer,
        playerCards: player.cards,
      });

      await this.roomService.updateInPlayer({
        id: roomId,
        values: { userId: player.userId, hand: evaluate },
      });
    }

    const roomUpdated = await this.roomService.findRoom(roomId);

    const playersInGame = roomUpdated.desk.players.filter(
      ({ action }) => action !== Status.fold,
    );

    const playerR = playersInGame.map((player) => ({
      _id: player.userId,
      name: player.username,
      bid: player.bid,
      ...player.hand,
    }));

    const playerWinners = getWinner(playerR);

    for (const player of roomUpdated.desk.players) {
      await this.missionService.checkMissionProgress({
        player,
        room: { winner: playerWinners.usersId },
        sockets,
      });
    }

    let message;
    let totalPot = room.desk.totalBid;

    if (!Array.isArray(playerWinners.usersId)) {
      const playerWinner = playersInGame.find(
        ({ userId }) => userId === playerWinners.usersId,
      );

      totalPot = await this.handOutChips({
        roomId,
        playerWinner,
        playersArr: playersInGame,
        totalPot,
      });

      message = `${playerWinner.username} won ${totalPot} chips with ${playerWinners.heirarchy}`;
      await this.roomService.updatePlayerChips({
        roomId,
        userId: playerWinners.usersId,
        chips: totalPot,
        winningPot: totalPot,
      });
      await this.userService.updateUserMatches({
        id: playerWinners.usersId,
        values: playerWinners.heirarchy,
      });
    } else {
      const filterPlayers = playersInGame.filter(({ userId }) =>
        playerWinners.usersId.includes(userId),
      );
      const playerLowerBid = filterPlayers.reduce((min, acc) =>
        acc.bid < min.bid ? acc : min,
      );

      totalPot = await this.handOutChips({
        roomId,
        playerWinner: playerLowerBid,
        playersArr: playersInGame,
        totalPot,
      });
      message = `${playerWinners.names} split ${totalPot} chips tied with ${playerWinners.heirarchy}`;

      playerWinners.usersId.forEach(async (userId) => {
        await this.roomService.updatePlayerChips({
          roomId,
          userId,
          chips: totalPot / playerWinners.usersId.length,
          winningPot: totalPot / playerWinners.usersId.length,
        });
        await this.userService.updateUserMatches({
          id: userId,
          values: playerWinners.heirarchy,
        });
      });
    }

    return {
      message:
        playersInGame.length === 1
          ? `${playersInGame[0].username} won ${room.desk.totalBid} chips`
          : message,
      cards: playerWinners.cards || null,
    };
  }

  async playerRebuyChips({
    values,
    sockets,
  }: PlayerRebuyChipsArgs): Promise<ErrorInterface> {
    const findPlayer = await this.userService.getUserById(values.userId);
    const findRoom = await this.roomService.findRoom(values.roomId);

    if (!findPlayer || !findRoom)
      return { error: true, message: 'Player not found' };
    if (findPlayer.chips < values.chips)
      return { error: true, message: "You don't have enough chips" };

    const socket = await findUserSocket({ sockets, userId: values.userId });
    await this.userService.updateChips({
      id: values.userId,
      chips: -findRoom.buyIn,
      socket,
    });
    await this.roomService.updatePlayerChips(values);
    return { error: false, message: 'Done' };
  }
}
