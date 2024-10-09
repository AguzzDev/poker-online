import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Desk {
  @Prop({ type: String, default: null })
  status: string | null;

  @Prop({ type: Number, default: 0 })
  bidToPay: number;

  @Prop({ type: Number, default: 0 })
  totalBid: number;

  @Prop({ type: Number, default: 4 })
  maxPlayerRoom: number;

  @Prop({ type: Number, default: 0 })
  blind: number;

  @Prop({ type: Array, default: [] })
  players: [];

  @Prop({ type: Array, default: [] })
  cards: [];

  @Prop({ type: Array, default: [] })
  dealer: [];
}

export const DeskSchema = SchemaFactory.createForClass(Desk);
