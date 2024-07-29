import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';
import { Status, CardInterface, PlayerInterface } from 'src/models';

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

  @Prop({type: Number, default: 0})
  players: number 
  
  @Prop({
    type: MongooseSchema.Types.Mixed,
    default: {
      status: null,
      bidToPay: 0,
      totalBid: 0,
      maxPlayerRoom: 4,
      blind: 0,
      cards: [],
      players: [],
      dealer: [],
    },
  })
  desk: {
    status: Status | null;
    bidToPay: number;
    totalBid: number;
    maxPlayerRoom: number;
    blind: number;
    cards: CardInterface[];
    players: PlayerInterface[];
    dealer: CardInterface[];
  };

  @Prop({
    type: Array,
    default: [],
  })
  messages: [];
}

export const RoomSchema = SchemaFactory.createForClass(Room);
