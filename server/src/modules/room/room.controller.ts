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
import { CreateRoomDto } from 'src/modules/common/dto';
import { AdminGuard, CreatorGuard } from 'src/modules/common/guards';
import { Request } from 'express';
import { handleError } from 'src/utils/errorHandler';

@Controller('room')
export class RoomController {
  constructor(private roomService: RoomService) {}

  @Get()
  a() {
    try {
      return this.roomService.findRooms();
    } catch (error) {
      handleError(error);
    }
  }

  @Get(':id')
  b(@Req() req: RequestInterface) {
    try {
      return this.roomService.findRoom(req.params.id);
    } catch (error) {
      handleError(error);
    }
  }

  @Post()
  @UseGuards(AdminGuard)
  c(@Body() values: CreateRoomDto) {
    try {
      return this.roomService.createRoom(values);
    } catch (error) {
      handleError(error);
    }
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  d(@Req() req: Request): Promise<any> {
    try {
      return this.roomService.deleteRoom(req.params.id);
    } catch (error) {
      handleError(error);
    }
  }

  @Delete()
  @UseGuards(CreatorGuard)
  e() {
    try {
      return this.roomService.deleteAllRooms();
    } catch (error) {
      handleError(error);
    }
  }
}
