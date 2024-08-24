import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Room } from 'src/schemas/room.schema';
import { UserService } from 'src/user/user.service';
import {
  AddPlayerArgs,
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
  ErrorInterface,
  MessageInterface,
  Status,
} from 'src/models';
import { CreateRoomDto } from 'src/dto';

@Injectable()
export class RoomService {
  constructor(
    @InjectModel(Room.name) private roomModel: Model<RoomInterface>,
    private userService: UserService,
  ) {}

  public rooms: RoomInterface[] = [];

  async findRooms(): Promise<RoomInterface[]> {
    if (this.rooms.length === 0) {
      const getRooms = (await this.roomModel.find({})).flat();

      this.rooms = getRooms;
    }

    return this.rooms;
  }

  async findRoom(id: string): Promise<RoomInterface> {
    try {
      return this.rooms.filter(({ _id }) => _id.toString() == id)[0];
    } catch (error) {
      throw new BadRequestException('Room not found');
    }
  }

  async updateInRoom({ id, values }: updateInRoomArgs): Promise<RoomInterface> {
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

  async updateInDesk({
    id,
    values,
    type,
  }: UpdateInDeskArgs): Promise<RoomInterface> {
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

        if (type === DeskTypesEnum.addPlayer) {
          updateRoom.desk.players = [...room.desk.players, values].sort(
            (a, b) => (a.sit > b.sit ? 1 : -1),
          );
          updateRoom.players = updateRoom.desk.players.length;

          this.rooms[i] = updateRoom;
          return updateRoom;
        }
        if (type === DeskTypesEnum.removePlayer) {
          updateRoom.desk.players = updateRoom.desk.players
            .filter((player) => player.userId != values.userId.toString())
            .sort((a, b) => (a.sit > b.sit ? 1 : -1));
          updateRoom.players = updateRoom.desk.players.length;

          this.rooms[i] = updateRoom;
          return updateRoom;
        }

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
          updateRoom.desk.totalBid = values.totalBid;
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

  async updateInMessages({
    id,
    values,
  }: UpdateInMessagesArgs): Promise<RoomInterface> {
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

  async updateInPlayer({
    id,
    values,
    type,
  }: UpdateInPlayerArgs): Promise<RoomInterface> {
    try {
      let updateRoom: RoomInterface;

      this.rooms.map(async (room, i) => {
        if (room._id.toString() === id) {
          updateRoom = room;

          const update = (values) => {
            updateRoom.desk.players = updateRoom.desk.players.map((player) => {
              return { ...player, ...values };
            });

            this.rooms[i] = updateRoom;
            return updateRoom;
          };

          if (type === PlayerTypesEnum.clearWinningPot) {
            return update({
              winningPot: 0,
            });
          }

          if (
            type === PlayerTypesEnum.clearActions ||
            type === PlayerTypesEnum.clearShowAction
          ) {
            updateRoom.desk.players = updateRoom.desk.players.map((player) => {
              if (type === PlayerTypesEnum.clearActions) {
                if (player.userId !== values.userId) return player;

                return { ...player, action: null };
              } else {
                if (
                  player.action == Status.fold ||
                  player.action == Status.allIn
                ) {
                  return player;
                }

                return { ...player, showAction: '' };
              }
            });

            this.rooms[i] = updateRoom;
            return updateRoom;
          }
          if (type === PlayerTypesEnum.reset) {
            return update({
              cards: [],
              action: '',
              showAction: '',
              bid: 0,
              blind: false,
            });
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

  async findUserInRoom(
    userId: string,
  ): Promise<{ id: string; player: PlayerInterface } | null> {
    const room = this.rooms.find((room) =>
      room.desk.players.find((player) => player.userId === userId),
    );

    if (!room) return null;

    return {
      id: room._id.toString(),
      player: room.desk.players.filter(
        (player) => player.userId === userId.toString(),
      )[0],
    };
  }

  async createRoom(values: CreateRoomDto) {
    const room = await this.roomModel.create({
      name: values.name,
      buyIn: Number(values.buyIn),
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

  async addPlayer({
    roomId,
    sit,
    socket,
  }: AddPlayerArgs): Promise<ErrorInterface | RoomInterface> {
    const room = await this.findRoom(roomId);
    const findUserInRooms = await this.findUserInRoom(
      socket.user._id.toString(),
    );

    if (findUserInRooms) return { error: true, message: 'Already in the room' };
    if (socket.user.chips < room.buyIn)
      return { error: true, message: 'No enough chips' };

    const defaultValues = {
      sit,
      action: null,
      bid: 0,
      winningPot: 0,
      blind: false,
      cards: [],
      hand: null,
      showAction: null,
    };

    const playerValues: PlayerInterface = {
      ...defaultValues,
      userId: socket.user._id.toString(),
      image: socket.user.image,
      chips: room.buyIn,
      username: socket.user.username,
    };

    await this.userService.updateChips({
      id: socket.user._id,
      chips: -room.buyIn,
      socket,
    });
    return await this.updateInDesk({
      id: roomId,
      values: playerValues,
      type: DeskTypesEnum.addPlayer,
    });
  }

  async removePlayer(userId: string) {
    const room = await this.findUserInRoom(userId);
    if (!room) return;

    const { id, player } = room;

    const roomUpdate = await this.updateInDesk({
      id,
      values: player,
      type: DeskTypesEnum.removePlayer,
    });

    await this.userService.updateChips({
      id: userId,
      chips: player.chips,
    });

    return roomUpdate;
  }

  async findPlayerMove({
    roomId,
    userId,
  }: findPlayerMoveArgs): Promise<PlayerInterface> {
    const { desk } = await this.findRoom(roomId);

    return desk.players.filter((v) => v.userId === userId)[0];
  }

  async updatePlayerChips({ roomId, ...rest }: UpdatePlayerChipsArgs) {
    await this.updateInPlayer({
      id: roomId,
      values: rest,
    });
  }

  async setMessage({
    roomId,
    message,
  }: SetMessageArgs): Promise<MessageInterface> {
    await this.roomModel.updateOne(
      { _id: roomId },
      {
        $push: {
          messages: {
            $each: [message],
            $slice: -50,
          },
        },
      },
    );

    const room = await this.updateInMessages({ id: roomId, values: message });

    return room.messages[room.messages.length - 1];
  }

  async deleteRoom(id: string): Promise<RoomInterface> {
    const room = await this.roomModel.findOneAndDelete({ _id: id });
    this.rooms = this.rooms.filter(({ _id }) => _id.toString() != id);

    return room;
  }

  async deleteAllRooms() {
    await this.roomModel.deleteMany({});
    this.rooms = [];
  }

  findPlayersEmptyChips(room: RoomInterface): PlayerInterface[] {
    return room.desk.players.filter(({ chips }) => chips == 0);
  }
}
