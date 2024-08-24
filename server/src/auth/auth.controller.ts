import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Post,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginInputDto, RegisterInputDto } from 'src/dto';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  a(@Body() body: LoginInputDto) {
    try {
      return this.authService.login(body);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  @Post('register')
  b(@Body() body: RegisterInputDto) {
    try {
      return this.authService.register(body);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  @Get('verify')
  c(@Req() req: Request) {
    try {
      const { token } = req.query;

      return this.authService.verify(token);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  @Post('changePassword')
  d(@Body() { email }: { email: string }) {
    try {
      return this.authService.changePassword(email);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  @Post('resetPassword')
  e(@Req() req: Request, @Body() values: { password: string }) {
    try {
      const { token } = req.query;

      return this.authService.resetPassword(token, values.password);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  @Post('oauth')
  f(@Body() values: any) {
    try {
      return this.authService.oAuth(values);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
