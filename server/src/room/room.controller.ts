import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { RoomService } from './room.service';
import { RequestInterface } from 'src/models';
import { CreateRoomDto } from 'src/dto';
import { AdminGuard } from 'src/guards/adminGuard';
import { Request } from 'express';
import { CreatorGuard } from 'src/guards/creatorGuard';

@Controller('room')
export class RoomController {
  constructor(private roomService: RoomService) {}

  @Get()
  a() {
    try {
      return this.roomService.findRooms();
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  @Get(':id')
  b(@Req() req: RequestInterface) {
    try {
      return this.roomService.findRoom(req.params.id);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  @Post()
  @UseGuards(AdminGuard)
  c(@Body() values: CreateRoomDto) {
    try {
      return this.roomService.createRoom(values);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  d(@Req() req: Request): Promise<any> {
    try {
      return this.roomService.deleteRoom(req.params.id);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  @Delete()
  @UseGuards(CreatorGuard)
  e() {
    try {
      return this.roomService.deleteAllRooms();
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
