import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameGateway } from './game.gateway';
import { RoomModule } from 'src/modules/room/room.module';
import { UserModule } from 'src/modules/user/user.module';
import { MissionModule } from 'src/modules/mission/mission.module';

@Module({
  imports: [RoomModule, UserModule, MissionModule],
  providers: [GameGateway, GameService],
})
export class GameModule {}
