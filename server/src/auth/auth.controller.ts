import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginInputValues, RegisterInputValues } from 'src/dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() body: LoginInputValues) {
    return this.authService.login(body);
  }

  @Post('register')
  async register(@Body() body: RegisterInputValues) {
    return this.authService.register(body);
  }
}
