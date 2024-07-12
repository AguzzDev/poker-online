import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateRoomDto {
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  own: string;
  withPass: boolean;

  @IsOptional()
  password?: string;
}
