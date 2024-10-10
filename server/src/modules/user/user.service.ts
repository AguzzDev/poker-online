import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from 'src/modules/common/schemas';
import {
  HandEnum,
  UpdateChipsArgs,
  UpdateMissionArgs,
  UpdateUserArgs,
  UserInterface,
} from 'src/models';
import { EVENTS } from 'const';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserInterface>,
  ) {}

  async getUsers(): Promise<UserInterface[]> {
    return await this.userModel.find({});
  }

  async getUser(value: string): Promise<UserInterface> {
    return await this.userModel.findOne({
      $or: [{ email: value }, { username: value }],
    });
  }

  async getUserByVerifyCode(token: string): Promise<UserInterface> {
    return await this.userModel.findOne({
      verifyCode: token,
    });
  }

  async getUserById(id: string): Promise<UserInterface> {
    return await this.userModel.findById({ _id: id });
  }

  async getUserByEmail(email: string): Promise<UserInterface> {
    return await this.userModel.findOne({ email });
  }

  async getUserByToken(token: string): Promise<string> {
    const user = await this.userModel.findOne({ accessToken: token });

    return user.username;
  }

  async createUser(values: Partial<UserInterface>): Promise<UserInterface> {
    if (values.provider) {
      const user = await this.userModel.create(values);
      return user;
    }

    const passwordEncrypted = bcrypt.hashSync(values.password, 12);
    const user = await this.userModel.create({
      ...values,
      password: passwordEncrypted,
    });
    return user;
  }

  async updateChips({ id, chips, socket }: UpdateChipsArgs) {
    const user = await this.userModel.findByIdAndUpdate(
      id,
      { $inc: { chips } },
      { new: true },
    );

    if (!socket) return user;
    socket.emit(EVENTS.SERVER.UPDATE_USER, { chips: user.chips });
  }

  async updateMission({ id, type }: UpdateMissionArgs) {
    return await this.userModel.findByIdAndUpdate(
      id,
      { $set: { [`missions.${type}.redeemed`]: true } },
      { new: true },
    );
  }

  async updateUser({ id, values }: UpdateUserArgs) {
    const update = async (id: string, values: Partial<UserInterface>) => {
      return await this.userModel.findByIdAndUpdate(id, {
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
      return await update(id, values);
    }
  }

  async updateUserMatches({ id, values }: { id: string; values: HandEnum }) {
    const heirarchy = {
      'High Card': 'highCard',
      'One Pair': 'onePair',
      'Two Pair': 'twoPair',
      'Three of a Kind': 'threeOfKind',
      Straight: 'straight',
      Flush: 'flush',
      'Full House': 'fullHouse',
      Poker: 'poker',
      'Straight Flush': 'straightFlush',
      'Royal Flush': 'royalFlush',
    };

    await this.userModel.findByIdAndUpdate(
      id,
      {
        $inc: {
          [`matches.${heirarchy[values]}`]: 1,
        },
      },
      { new: true },
    );
  }

  async removeUser(): Promise<any> {
    return await this.userModel.deleteMany({});
  }

  async getUserMissions(id: string) {
    return (await this.userModel.findById(id).lean()).missions;
  }
}
