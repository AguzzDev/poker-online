import {
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Request } from 'express';
import { UserRoleEnum } from 'src/models';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  a() {
    try {
      return this.userService.getUsers();
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  @Get(':id')
  b(@Req() req: Request) {
    try {
      return this.userService.getUserById(req.params.id);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  @Get('/dashboard/:id')
  async c(@Req() req: Request) {
    try {
      const user = await this.userService.getUserById(req.params.id);
      return user.role === UserRoleEnum.creator;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  @Delete()
  d() {
    try {
      return this.userService.removeUser();
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
