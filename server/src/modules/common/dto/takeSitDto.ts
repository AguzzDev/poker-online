import { IsNotEmpty } from 'class-validator';

export class TakeSitDto {
  @IsNotEmpty()
  roomId: string;

  @IsNotEmpty()
  sit: number;
}
