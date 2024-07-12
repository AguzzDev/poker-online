import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';

@Schema({ timestamps: true, _id: true })
export class User {
  @Prop({ required: true })
  username: string;

  @Prop({ required: false, default: '' })
  image: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: 100000 })
  chips: number;

  @Prop({ default: 'user' })
  role: string;

  @Prop(
    raw({
      wins: { type: Number, default: 0 },
      loses: { type: Number, default: 0 },
      par: { type: Number, default: 0 },
      trio: { type: Number, default: 0 },
      full: { type: Number, default: 0 },
      poker: { type: Number, default: 0 },
      flush: { type: Number, default: 0 },
      straight: { type: Number, default: 0 },
      straightFlush: { type: Number, default: 0 },
      straightFlushReal: { type: Number, default: 0 },
    }),
  )
  matches: {
    wins: number;
    loses: number;
    par: number;
    trio: number;
    full: number;
    poker: number;
    flush: number;
    straight: number;
    straightFlush: number;
    straightFlushReal: number;
  };

  @Prop()
  lastRoomVisited: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
