import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { RoomService } from './room.service';
import { RequestInterface, RoomInterface } from 'src/models';
import { Room } from 'src/schemas/room.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateRoomDto } from 'src/dto';
import { AdminGuard } from 'src/guards/adminGuard';
import { Request } from 'express';

@Controller('room')
export class RoomController {
  constructor(private roomService: RoomService) {}

  @Get()
  a() {
    return this.roomService.getRooms();
  }

  @Get(':id')
  b(@Req() req: RequestInterface) {
    return this.roomService.findRoom(req.params.id);
  }

  @Post()
  @UseGuards(AdminGuard)
  c(@Body() values: CreateRoomDto) {
    return this.roomService.createRoom(values);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  async d(@Req() req: Request): Promise<any> {
    return this.roomService.deleteRoom(req.params.id);
  }

  @Delete()
  async e() {
    return this.roomService.deleteAllRooms();
  }
}
