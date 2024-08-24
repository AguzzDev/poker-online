import { IsNotEmpty } from 'class-validator';

export class ConnectRoomDto {
  @IsNotEmpty()
  id: string;
}
