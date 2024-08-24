import { IsNotEmpty, IsOptional } from 'class-validator';

export class SendMessageDto {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  message: string;
}
