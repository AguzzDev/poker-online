import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { CardInterface } from 'src/models';

@Schema()
export class Message {
  @Prop({ type: String, required: true })
  userId: string;
  
  @Prop({ type: String, required: true })
  username: string;

  @Prop({ type: String, required: true })
  message: string;

  @Prop({ type: String, required: true })
  image: string;

  @Prop({ type: Date, required: true })
  timestamp: Date;

  @Prop({ type: [{ type: Object }], default: [] })
  cards: CardInterface[];
}

export const MessageSchema = SchemaFactory.createForClass(Message);
