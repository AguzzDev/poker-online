import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';

@Schema({ timestamps: true, _id: true })
export class User {
  @Prop({ required: true, min: 3 })
  username: string;

  @Prop({ required: false, default: 'default' })
  image: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ min: 6, default: '' })
  password: string;

  @Prop({ default: 1000000 })
  chips: number;

  @Prop({ default: '' })
  provider: string;

  @Prop({ default: 'user' })
  role: string;

  @Prop(
    raw({
      highCard: { type: Number, default: 0 },
      onePair: { type: Number, default: 0 },
      twoPair: { type: Number, default: 0 },
      threeOfKind: { type: Number, default: 0 },
      straight: { type: Number, default: 0 },
      flush: { type: Number, default: 0 },
      fullHouse: { type: Number, default: 0 },
      poker: { type: Number, default: 0 },
      straightFlush: { type: Number, default: 0 },
      royalFlush: { type: Number, default: 0 },
    }),
  )
  matches: {
    highCard: number;
    onePair: number;
    twoPair: number;
    threeOfKind: number;
    straight: number;
    flush: number;
    fullHouse: number;
    poker: number;
    straightFlush: number;
    royalFlush: number;
  };

  @Prop()
  verifyCode: string;

  @Prop({ default: false })
  verify: boolean;

  @Prop({ default: '' })
  accessToken: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
