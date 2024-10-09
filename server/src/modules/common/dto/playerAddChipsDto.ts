import { IsNotEmpty } from 'class-validator';

export class PlayerAddChipsDto {
  @IsNotEmpty()
  roomId: string;

  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  chips: number;
}
