import { Controller, Delete, Get } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  getUsers() {
    return this.userService.getUsers();
  }

  @Delete()
  async w(): Promise<any> {
   return this.userService.removeUser()
  }
}
