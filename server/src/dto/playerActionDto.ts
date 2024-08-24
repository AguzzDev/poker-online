import { IsNotEmpty, IsOptional } from 'class-validator';
import { Status } from 'src/models';

export class PlayerActionDto {
  @IsNotEmpty()
  roomId: string;

  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  action: Status;

  @IsOptional()
  bid?: number;

  @IsOptional()
  totalBid?: number;

  @IsOptional()
  bidToPay?: number;
}
