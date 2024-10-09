import { Module, OnModuleInit } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MissionService } from './mission.service';
import { MissionController } from './mission.controller';
import { User, UserSchema } from 'src/modules/common/schemas';
import { MissionCategoryEnum } from 'src/models';
import { UserModule } from 'src/modules/user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    UserModule,
  ],
  providers: [MissionService],
  controllers: [MissionController],
  exports: [MissionService],
})
export class MissionModule implements OnModuleInit {
  constructor(private readonly missionService: MissionService) {}

  async onModuleInit() {
    // await this.missionService.updateUsers()
    // await this.missionService.assignMissions(MissionCategoryEnum.daily);
    // await this.missionService.assignMissions(MissionCategoryEnum.weekly);
    // await this.missionService.assignMissions(MissionCategoryEnum.monthly);
    // await this.missionService.assignMissions(MissionCategoryEnum.master);
  }
}
