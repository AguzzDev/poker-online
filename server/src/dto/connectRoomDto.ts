import { IsNotEmpty, IsOptional } from 'class-validator';

export class ConnectRoomDto {
  @IsNotEmpty()
  id: string;

  @IsOptional()
  password?: string;
}
