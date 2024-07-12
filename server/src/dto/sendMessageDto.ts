import { IsNotEmpty, IsOptional } from 'class-validator';

export class SendMessageDto {
  @IsNotEmpty()
  message: string;
}
