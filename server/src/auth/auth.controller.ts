import {
  Body,
  Controller,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginInputDto, RegisterInputDto } from 'src/dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  login(@Body() body: LoginInputDto) {
    try {
      return this.authService.login(body);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  @Post('register')
  register(@Body() body: RegisterInputDto) {
    try {
      return this.authService.register(body);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
