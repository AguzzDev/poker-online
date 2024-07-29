import {
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
} from '@nestjs/common';
import { UserService } from './user.service';

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

  @Delete()
  b() {
    try {
      return this.userService.removeUser();
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
