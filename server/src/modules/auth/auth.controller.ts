import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Post,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginInputDto, RegisterInputDto } from 'src/modules/common/dto';
import { Request } from 'express';
import { handleError } from 'src/utils/errorHandler';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async a(@Body() body: LoginInputDto) {
    try {
      return await this.authService.login(body);
    } catch (error) {
      handleError(error);
    }
  }

  @Post('register')
  async b(@Body() body: RegisterInputDto) {
    try {
      await this.authService.register(body);
    } catch (error) {
      handleError(error);
    }
  }

  @Get('verify')
  c(@Req() req: Request) {
    try {
      const { token } = req.query;

      return this.authService.verify(token);
    } catch (error) {
      handleError(error);
    }
  }

  @Post('changePassword')
  async d(@Body() { email }: { email: string }) {
    try {
      await this.authService.changePassword(email);
    } catch (error) {
      handleError(error);
    }
  }

  @Post('resetPassword')
  async e(@Req() req: Request, @Body() values: { password: string }) {
    try {
      const { token } = req.query;

      await this.authService.resetPassword(token, values.password);
    } catch (error) {
      handleError(error);
    }
  }

  @Post('oauth')
  async f(@Body() values: any) {
    try {
      return await this.authService.oAuth(values);
    } catch (error) {
      handleError(error);
    }
  }
}
