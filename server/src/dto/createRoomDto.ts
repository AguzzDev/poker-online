import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateRoomDto {
  @IsNotEmpty({ message: 'Required' })
  name: string;

  @IsNotEmpty({ message: 'Required' })
  buyIn: string;
}
