import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, Mission } from 'src/modules/common/schemas';
import {
  DAILY_MISSIONS,
  MASTER_MISSIONS,
  MONTHLY_MISSIONS,
  WEEKLY_MISSIONS,
} from 'data/missions';
import {
  HandEnum,
  MissionCategoryEnum,
  MissionInterface,
  MissionTypeEnum,
  PlayerInterface,
} from 'src/models';
import { Cron, CronExpression } from '@nestjs/schedule';
import { findUserSocket } from 'src/utils/findPlayerSocket';
import { Server } from 'socket.io';
import { EVENTS } from 'const';
import { UserService } from 'src/modules/user/user.service';
import { formatChips } from 'src/utils/formatChips';

@Injectable()
export class MissionService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private userService: UserService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async assignDailyMissions(): Promise<void> {
    await this.assignMissions(MissionCategoryEnum.daily);
  }

  @Cron(CronExpression.EVERY_WEEK)
  async assignWeeklyMissions(): Promise<void> {
    await this.assignMissions(MissionCategoryEnum.weekly);
  }

  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT)
  async assignMonthlyMissions(): Promise<void> {
    await this.assignMissions(MissionCategoryEnum.monthly);
  }

  @Cron(CronExpression.EVERY_6_MONTHS)
  async assignMasterMissions(): Promise<void> {
    await this.assignMissions(MissionCategoryEnum.master);
  }

  async assignMissions(type: MissionCategoryEnum): Promise<void> {
    const missionsType = {
      daily: DAILY_MISSIONS,
      weekly: WEEKLY_MISSIONS,
      monthly: MONTHLY_MISSIONS,
      master: MASTER_MISSIONS,
    };

    const newMissions = this.generateRandomMissions(missionsType[type], 3);

    await this.userModel.updateMany(
      {},
      { $set: { [`missions.${type}.missions`]: [] } },
    );
    await this.userModel.updateMany(
      {},
      { $set: { [`missions.${type}.missions`]: newMissions } },
    );
  }

  async checkMissionProgress({
    sockets,
    player,
    room,
  }: {
    player: PlayerInterface;
    room: { winner: string | string[] };
    sockets: Server['sockets'];
  }) {
    let missionsUpdated = [];

    const playerMissions = await this.userService.getUserMissions(
      player.userId,
    );

    const findMissions = (mission, inc) => {
      if (mission.progress + inc >= mission.requirement) {
        mission.progress = mission.requirement;
      } else {
        mission.progress += inc;
      }

      if (mission.progress >= mission.requirement) {
        mission.completed = true;
      }
    };

    for (const key of Object.keys(playerMissions)) {
      playerMissions[key].missions.forEach((mission: MissionInterface) => {
        if (mission.progress >= mission.requirement) return;

        switch (mission.type) {
          case MissionTypeEnum.Chips:
            if (player.bid == 0) break;

            findMissions(mission, player.bid);
            missionsUpdated.push(mission);
            break;

          case MissionTypeEnum.Hand:
            if (
              HandEnum[player.hand.heirarchy] === HandEnum[mission.value] &&
              player.userId === room.winner
            ) {
              findMissions(mission, 1);
              missionsUpdated.push(mission);
            }
            break;

          case MissionTypeEnum.Rounds:
            if (player.userId === room.winner) {
              findMissions(mission, 1);
              missionsUpdated.push(mission);
            }
            break;
        }
      });
    }

    if (missionsUpdated.length > 0) {
      await this.userModel.findByIdAndUpdate(player.userId, {
        $set: { missions: playerMissions },
      });

      const missionMessage = missionsUpdated.map((mission) => {
        if (mission.progress >= mission.requirement) {
          return {
            name: `Mission Completed: ${mission.name}`,
            value: ``,
          };
        } else {
          return {
            name: `Mission Progress: ${mission.name}`,
            value: `Progress: ${formatChips(mission.progress)}/${formatChips(mission.requirement)}`,
          };
        }
      });

      const socket = findUserSocket({ sockets, userId: player.userId });
      socket.emit(EVENTS.SERVER.MISSION_PROGRESS, missionMessage);
    }
  }

  private generateRandomMissions(
    missionsArray,
    count: number,
  ): Partial<Mission>[] {
    return missionsArray.sort(() => 0.5 - Math.random()).slice(0, count);
  }

  async updateUsers() {
    await this.userModel.updateMany(
      {},
      {
        $set: {
          missions: {
            daily: {},
            weekly: {},
            monthly: {},
            master: {},
          },
        },
      },
    );
  }
}
