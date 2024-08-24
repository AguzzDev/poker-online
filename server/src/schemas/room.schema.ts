import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';
import { Desk, DeskSchema } from './desk.schema';
import { Message, MessageSchema } from './message.schema';

@Schema({ timestamps: true })
export class Room {
  @Prop({ type: String })
  name: string;

  @Prop({ type: String, default: '' })
  password: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  own: string;

  @Prop({ type: Boolean, default: false })
  start: boolean;

  @Prop({ type: Number, default: 10000 })
  buyIn: number;

  @Prop({ type: Number, default: 0 })
  players: number;

  @Prop({ type: DeskSchema, default: () => ({}) })
  desk: Desk;

  @Prop({
    type: [MessageSchema],
    default: () => [],
  })
  messages: Message[];
}

export const RoomSchema = SchemaFactory.createForClass(Room);
