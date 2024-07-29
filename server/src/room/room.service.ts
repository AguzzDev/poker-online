import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import bcrypt from 'bcrypt';

import { Room } from 'src/schemas/room.schema';
import { UserService } from 'src/user/user.service';
import {
  AddPlayerArgs,
  Status,
  RoomInterface,
  SetMessageArgs,
  UpdateDeskOptionsEnum,
  UpdateInDeskArgs,
  UpdateInMessagesArgs,
  UpdateInPlayerArgs,
  PlayerTypesEnum,
  UpdatePlayerChipsArgs,
  UpdatePlayerOptionsEnum,
  findPlayerMoveArgs,
  DeskTypesEnum,
  PlayerInterface,
  updateInRoomArgs,
} from 'src/models';
import { WsException } from '@nestjs/websockets';
import { CreateRoomDto } from 'src/dto';

@Injectable()
export class RoomService {
  constructor(
    @InjectModel(Room.name) private roomModel: Model<RoomInterface>,
    private userService: UserService,
  ) {}

  public rooms: RoomInterface[] = [];

  async addPlayerInDesk({ id, values }) {
    await this.roomModel.findOneAndUpdate(
      { _id: id },
      { $push: { 'desk.players': values }, $inc: { players: 1 } },
      { new: true },
    );
  }

  async removePlayerInDesk({ id, values }) {
    await this.roomModel.findOneAndUpdate(
      { _id: id },
      { $pull: { 'desk.players': values }, $inc: { players: -1 } },
      { new: true },
    );
  }

  async findRooms() {
    if (this.rooms.length === 0) {
      const getRooms = (await this.roomModel.find({})).flat();

      this.rooms = getRooms;
    }

    return this.rooms;
  }

  async findRoom(id: string) {
    try {
      return this.rooms.filter(({ _id }) => _id.toString() == id)[0];
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async updateInRoom({ id, values }: updateInRoomArgs) {
    try {
      let updateRoom;

      this.rooms.map((room, i) => {
        if (room._id.toString() !== id) return room;

        updateRoom = Object.assign(room, values);

        this.rooms[i] = updateRoom;
        return updateRoom;
      });

      return updateRoom;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async updateInDesk({ id, values, type }: UpdateInDeskArgs) {
    try {
      let updateRoom;
      const resetValues = {
        status: null,
        totalBid: 0,
        bidToPay: 0,
        cards: [],
        dealer: [],
      };

      this.rooms.map(async (room, i) => {
        if (room._id.toString() != id) return room;
        updateRoom = room;

        if (type !== DeskTypesEnum.dealer && values?.cards) {
          updateRoom.desk.cards = [...updateRoom.desk.cards, ...values.cards];
        }
        if (type === DeskTypesEnum.stop || type === DeskTypesEnum.reset) {
          updateRoom.desk = Object.assign(updateRoom.desk, resetValues);
        }
        if (type === DeskTypesEnum.takeCard) {
          updateRoom.desk.cards.splice(-1);
        }
        if (type === DeskTypesEnum.dealer) {
          updateRoom.desk.dealer = updateRoom.desk.dealer.concat(values.cards);
        }
        if (values?.status !== undefined) {
          updateRoom.desk.status = values.status;
        }

        if (values?.totalBid) {
          updateRoom.desk.totalBid += values.totalBid;
        }

        if (values) {
          Object.keys(values).forEach((key) => {
            const valueKey =
              UpdateDeskOptionsEnum[key as keyof typeof UpdateDeskOptionsEnum];

            if (valueKey) {
              updateRoom.desk[valueKey] = values[key];
            }
          });
        }

        this.rooms[i] = updateRoom;
        return updateRoom;
      });

      return updateRoom;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async updateInMessages({ id, values }: UpdateInMessagesArgs) {
    try {
      let updateRoom;

      this.rooms.map((room, i) => {
        if (room._id.toString() === id) {
          updateRoom = room;
          (updateRoom.messages = updateRoom.messages.concat(values)),
            (this.rooms[i] = updateRoom);
        }

        return room;
      });

      return updateRoom;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
  async updateInPlayer({ id, values, type }: UpdateInPlayerArgs) {
    try {
      let updateRoom: RoomInterface;

      this.rooms.map(async (room, i) => {
        if (room._id.toString() === id) {
          updateRoom = room;
          if (type === PlayerTypesEnum.add) {
            updateRoom.desk.players = [...room.desk.players, values].sort(
              (a, b) => (a.sit > b.sit ? 1 : -1),
            );
            this.rooms[i] = updateRoom;
            return updateRoom;
          }
          if (type === PlayerTypesEnum.delete) {
            await this.removePlayerInDesk({ id, values });

            updateRoom.desk.players = updateRoom.desk.players
              .filter((player) => player.userId != values.userId.toString())
              .sort((a, b) => (a.sit > b.sit ? 1 : -1));

            this.rooms[i] = updateRoom;
            return updateRoom;
          }
          if (type === PlayerTypesEnum.clearActions) {
            updateRoom.desk.players = updateRoom.desk.players.map((player) => {
              if (player.userId == values.userId) return player;

              return {
                ...player,
                action: '',
                showAction: '',
              };
            });

            this.rooms[i] = updateRoom;
            return updateRoom;
          }
          if (type === PlayerTypesEnum.reset || type === PlayerTypesEnum.stop) {
            updateRoom.desk.players = updateRoom.desk.players.map((player) => {
              return {
                ...player,
                cards: type === PlayerTypesEnum.stop ? player.cards : [],
                action: '',
                showAction: '',
                bid: 0,
                blind: false,
              };
            });
            this.rooms[i] = updateRoom;
            return updateRoom;
          }
          if (type === PlayerTypesEnum.endRound) {
            updateRoom.desk.players = updateRoom.desk.players.map((player) => {
              if (player.action == Status.fold || player.action == Status.allIn)
                return player;

              return {
                ...player,
                action: '',
                showAction: '',
              };
            });
            this.rooms[i] = updateRoom;

            return updateRoom;
          }

          updateRoom.desk.players = updateRoom.desk.players.map((player) => {
            if (player.userId !== values.userId) return player;

            if (values.bid) {
              player.bid += values.bid;
            }
            if (values.chips) {
              player.chips += values.chips;
            }

            Object.keys(values).forEach((key) => {
              if (key in UpdatePlayerOptionsEnum) {
                player[key] = values[key];
              }
            });

            return player;
          });

          this.rooms[i] = updateRoom;
          return updateRoom;
        }

        return room;
      });

      return updateRoom;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async findUserInRoom(id: string) {
    return this.rooms
      .filter((room) =>
        room.desk.players.some((player) => player.userId === id),
      )
      .map((room) => ({
        id: room._id.toString(),
        player: room.desk.players.filter(({ userId }) => userId)[0],
      }));
  }

  async createRoom(values: CreateRoomDto) {
    const { withPass, ...res } = values;

    const passHash =
      values.password && (await bcrypt.hash(values.password, 12));

    const room = await this.roomModel.create({
      ...res,
      password: passHash,
    });

    const updateRoom = await this.roomModel.findOneAndUpdate(
      room._id,
      {
        $set: { 'desk.blind': (1 * room.buyIn) / 100 },
      },
      { new: true },
    );

    this.rooms.push(updateRoom);
    return room;
  }

  async addPlayer({ roomId, sit, socket }: AddPlayerArgs) {
    const room = await this.findRoom(roomId);
    const findUserInRooms = await this.findUserInRoom(
      socket.user._id.toString(),
    );

    if (findUserInRooms.length > 0)
      throw new WsException('Ya estas en una sala');
    if (socket.user.chips < room.buyIn)
      throw new WsException('Chips insuficientes');

    const playerValues: PlayerInterface = {
      userId: socket.user._id.toString(),
      name: socket.user.username,
      chips: room.buyIn,
      sit,
      action: null,
      bid: 0,
      blind: false,
      cards: [],
      hand: null,
      showAction: null,
    };

    await this.userService.updateUser({
      id: socket.user._id,
      values: { lastRoomVisited: roomId },
    });
    await this.userService.updateChips({
      id: socket.user._id,
      chips: -room.buyIn,
      socket,
    });
    return await this.updateInPlayer({
      id: roomId,
      values: playerValues,
      type: PlayerTypesEnum.add,
    });
  }

  async removePlayer(userId: string) {
    const findUserInRooms = await this.findUserInRoom(userId);
    if (findUserInRooms.length === 0) return;

    return await Promise.all(
      findUserInRooms.map(async ({ id, player }) => {
        await this.userService.updateUser({
          id: player.userId,
          values: { lastRoomVisited: null },
        });
        await this.userService.updateChips({
          id: player.userId,
          chips: player.chips,
        });

        return await this.updateInPlayer({
          id: id,
          values: player,
          type: PlayerTypesEnum.delete,
        });
      }),
    );
  }

  async findPlayerMove({ roomId, userId }: findPlayerMoveArgs) {
    const { desk } = await this.findRoom(roomId);

    const player = desk.players.filter((v) => v.userId === userId)[0];

    return {
      chips: desk.totalBid,
      playersQuantity: desk.players.length,
      deskStatus: desk.status,
      bidToPay: desk.bidToPay,
      player: !player
        ? { action: Status.fold, bid: null }
        : { action: Status[player.action], bid: player.bid },
    };
  }

  async updatePlayerChips({ roomId, userId, chips }: UpdatePlayerChipsArgs) {
    await this.updateInPlayer({
      id: roomId,
      values: { userId, chips },
    });
  }

  async setMessage({ roomId, message }: SetMessageArgs) {
    await this.roomModel.findOneAndUpdate(
      { _id: roomId },
      {
        $push: {
          messages: message,
        },
      },
      { new: true },
    );

    const room = await this.updateInMessages({ id: roomId, values: message });

    return room.messages[room.messages.length - 1];
  }

  async deleteRoom(id: string): Promise<RoomInterface> {
    const room = await this.roomModel.findOneAndDelete({ _id: id });
    this.rooms = this.rooms.filter(({ _id }) => _id.toString() != id);

    return room;
  }

  async deleteAllRooms(): Promise<any> {
    await this.roomModel.deleteMany({});
    this.rooms = [];
  }

  findPlayersEmptyChips(room: RoomInterface): PlayerInterface[] {
    return room.desk.players.filter(({ chips }) => chips == 0);
  }
}
