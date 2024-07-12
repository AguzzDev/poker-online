import { BadRequestException, Injectable } from '@nestjs/common';
import { LoginInputValues } from 'src/dto/loginInputValues';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UserService } from 'src/user/user.service';
import { RegisterInputValues } from 'src/dto/registerInputValues';
import { UserInterface } from 'src/models';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(body: LoginInputValues) {
    const { email: vEmail, password: vPassword } = body;
    const user = await this.usersService.getUser(vEmail);

    if (!user) {
      throw new BadRequestException({
        message: { email: 'Usuario no encontrado' },
      });
    }

    const isMatch = await bcrypt.compare(vPassword, user.password);
    if (!isMatch) {
      throw new BadRequestException({
        message: { password: 'passwords doesnt match' },
      });
    }

    const accessToken = await this.jwtService.signAsync({
      id: user._id,
    });

    const userResponse: Partial<UserInterface> = {
      _id: user._id,
      username: user.username,
      image: user.image,
      chips: user.chips,
      matches: user.matches,
      accessToken,
      createdAt: user.createdAt,
    };

    return userResponse;
  }

  async register(body: RegisterInputValues) {
    const findUser = await this.usersService.getUser(body.email);

    if (findUser) {
      throw new BadRequestException({ message: { email: 'mail ya usado' } });
    }

    const user = await this.usersService.createUser(body);
    const accessToken = await this.jwtService.signAsync({
      id: user._id,
    });

    const userResponse: Partial<UserInterface> = {
      _id: user._id,
      username: user.username,
      image: user.image,
      chips: user.chips,
      matches: user.matches,
      accessToken,
      createdAt: user.createdAt,
    };

    return userResponse
  }
}
