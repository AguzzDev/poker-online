import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UserService } from 'src/user/user.service';
import { LoginInputDto } from 'src/dto/loginInputDto';
import { RegisterInputDto } from 'src/dto/registerInputDto';
import { UserInterface } from 'src/models';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(body: LoginInputDto) {
    const { email: vEmail, password: vPassword } = body;
    const user = await this.usersService.getUser(vEmail);

    if (!user) {
      throw new BadRequestException({
        message: { email: 'user not exist' },
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
      role: user.role,
    };

    return userResponse;
  }

  async register(body: RegisterInputDto) {
    const findUser = await this.usersService.getUser(body.email);

    if (findUser) {
      throw new BadRequestException({ message: { email: 'mail ya usado' } });
    }

    //mailgun
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
      role: user.role,
    };

    return userResponse;
  }
}
