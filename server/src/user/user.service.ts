import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { User } from 'src/schemas/user.schema';
import {
  RoomInterface,
  UpdateChipsArgs,
  UpdateUserArgs,
  UserInterface,
} from 'src/models';
import { RegisterInputDto } from 'src/dto/registerInputDto';
import { EVENTS } from 'const';
import { Room } from 'src/schemas/room.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserInterface>,
    @InjectModel(Room.name) private roomModel: Model<RoomInterface>,
  ) {}

  async getUsers(): Promise<UserInterface[]> {
    return await this.userModel.find({});
  }

  async getUser(value: string): Promise<UserInterface> {
    return await this.userModel.findOne({
      $or: [{ email: value }, { username: value }],
    });
  }

  async getUserById(id: string): Promise<UserInterface> {
    return await this.userModel.findById({ _id: id });
  }

  async createUser(values: RegisterInputDto): Promise<UserInterface> {
    const passwordEncrypted = bcrypt.hashSync(values.password, 12);
    const user = await this.userModel.create({
      ...values,
      password: passwordEncrypted,
    });

    return user;
  }

  async updateChips({ id, chips, socket }: UpdateChipsArgs) {
    const { chips: playerChips } = await this.userModel.findByIdAndUpdate(
      id,
      { $inc: { chips } },
      { new: true },
    );

    if (!socket) return;
    socket.emit(EVENTS.SERVER.PLAYER_CHIPS, playerChips);
  }

  async updateUser({ id, values }: UpdateUserArgs) {
    const update = async (id: string, values: Partial<UserInterface>) => {
      await this.userModel.findByIdAndUpdate(id, {
        $set: values,
      });
    };

    if (Array.isArray(values)) {
      await Promise.all(
        values.map(async (v) => {
          await update(id, v);
        }),
      );
    } else {
      await update(id, values);
    }
  }

  async removeUser(): Promise<any> {
    return await this.userModel.deleteMany({});
  }
}
