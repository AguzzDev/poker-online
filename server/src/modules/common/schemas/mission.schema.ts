import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HandEnum, MissionTypeEnum } from 'src/models';

@Schema()
class Missions {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  requirement: number;

  @Prop({ default: 0 })
  progress: number;

  @Prop({ required: true, enum: MissionTypeEnum })
  type: MissionTypeEnum;

  @Prop({ enum: HandEnum, required: false, default: null })
  value?: HandEnum;

  @Prop({ required: false, default: false })
  completed?: boolean;
}
const MissionsSchema = SchemaFactory.createForClass(Missions);

@Schema()
export class Mission {
  @Prop({ type: [MissionsSchema], required: true })
  missions: Mission[];

  @Prop({ required: true, default: false })
  redeemed: boolean;
}
export const MissionSchema = SchemaFactory.createForClass(Mission);
