import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Request } from 'express';
import { MissionCategoryEnum, UserRoleEnum } from 'src/models';
import { userResponse } from 'src/utils/userResponse';
import { claimRewards } from 'src/utils/claimRewards';
import { handleError } from 'src/utils/errorHandler';
import { CreatorGuard } from '../common/guards';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  a() {
    try {
      return this.userService.getUsers();
    } catch (error) {
      handleError(error);
    }
  }

  @Get(':id')
  async b(@Req() req: Request) {
    try {
      const user = await this.userService.getUserById(req.params.id);

      if (!user) {
        throw new BadRequestException({
          message: 'User not exist',
        });
      }

      return userResponse(user);
    } catch (error) {
      handleError(error);
    }
  }

  @Get('/dashboard/:id')
  @UseGuards(CreatorGuard)
  async c() {
    return true;
  }

  @Post('/rewards/:id')
  async d(
    @Req() req: Request,
    @Body() { type }: { type: MissionCategoryEnum },
  ) {
    const rewards = claimRewards(type);

    await this.userService.updateChips({
      id: req.params.id,
      chips: rewards,
    });
    return await this.userService.updateMission({
      id: req.params.id,
      type,
    });
  }

  @Delete()
  e() {
    try {
      return this.userService.removeUser();
    } catch (error) {
      handleError(error);
    }
  }
}
