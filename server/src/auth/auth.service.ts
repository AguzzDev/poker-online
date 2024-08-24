import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UserService } from 'src/user/user.service';
import { LoginInputDto } from 'src/dto/loginInputDto';
import { RegisterInputDto } from 'src/dto/registerInputDto';
import { MailTypeEnum, UserInterface } from 'src/models';
import sendMail from 'src/utils/sendMail';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async signJWT(id: string): Promise<Partial<UserInterface>> {
    const accessToken = await this.jwtService.signAsync({
      id,
    });

    const res = await this.usersService.updateUser({
      id,
      values: { accessToken },
    });

    return {
      _id: res._id,
      username: res.username,
      image: res.image,
      chips: res.chips,
      provider: res.provider,
      matches: res.matches,
      accessToken,
      createdAt: res.createdAt,
      role: res.role,
    };
  }

  async login(body: LoginInputDto) {
    const { email: vEmail, password: vPassword } = body;
    const user = await this.usersService.getUser(vEmail);

    if (!user) {
      throw new BadRequestException({
        message: { email: 'User not exist' },
      });
    }
    if (user.provider) {
      throw new BadRequestException({
        message: {
          email: `Log in with ${user.provider.slice(0, 1).toUpperCase() + user.provider.slice(1)}`,
        },
      });
    }
    if (!user.verify) {
      throw new BadRequestException({
        message: { email: 'Email not verified' },
      });
    }

    const isMatch = await bcrypt.compare(vPassword, user.password);
    if (!isMatch) {
      throw new BadRequestException({
        message: { password: 'Passwords doesnt match' },
      });
    }

    return await this.signJWT(user._id);
  }

  async register(body: RegisterInputDto) {
    const findUser = await this.usersService.getUser(body.email);

    if (findUser) {
      throw new BadRequestException({
        message: { email: 'Email already taken' },
      });
    }

    const verifyCode = (await sendMail({
      type: MailTypeEnum.verifyEmail,
      email: body.email,
    })) as string;

    await this.usersService.createUser({
      ...body,
      verifyCode,
    });

    throw new HttpException(
      { message: 'Account created, please check your mail' },
      HttpStatus.CREATED,
    );
  }

  async verify(token) {
    if (!token) throw new BadRequestException('Token is missing');

    const findUser = await this.usersService.getUserByVerifyCode(token);
    if (findUser.verify) {
      throw new BadRequestException('You are already verified');
    }

    await this.usersService.updateUser({
      id: findUser._id,
      values: { verify: true },
    });

    await sendMail({ type: MailTypeEnum.welcome, email: findUser.email });
    throw new HttpException(
      { message: 'Verified', user: await this.signJWT(findUser._id) },
      HttpStatus.OK,
    );
  }

  async resetPassword(token, password) {
    if (!token) throw new BadRequestException('Token is missing');

    const findUser = await this.usersService.getUserByVerifyCode(token);

    await sendMail({
      type: MailTypeEnum.resetPasswordSuccesful,
      email: findUser.email,
    });

    await this.usersService.updateUser({
      id: findUser._id,
      values: { password: bcrypt.hashSync(password, 12) },
    });

    throw new HttpException(
      { message: 'Password changed', user: await this.signJWT(findUser._id) },
      HttpStatus.OK,
    );
  }

  async changePassword(email: string) {
    const findUser = await this.usersService.getUserByEmail(email);
    if (!findUser)
      throw new BadRequestException({ message: { email: 'User not found' } });

    if (findUser.provider) {
      throw new BadRequestException({
        message: {
          email: `Log in with ${findUser.provider.slice(0, 1).toUpperCase() + findUser.provider.slice(1)}`,
        },
      });
    }

    const verifyCode = (await sendMail({
      type: MailTypeEnum.resetPassword,
      email,
    })) as string;

    await this.usersService.updateUser({
      id: findUser._id,
      values: { verifyCode },
    });

    throw new HttpException({ message: 'Mail send' }, HttpStatus.OK);
  }

  async oAuth(values: any) {
    const findUser = await this.usersService.getUserByEmail(values.email);

    if (!findUser) {
      const user = await this.usersService.createUser({
        ...values,
        verify: true,
        provider: values.provider,
      });

      await sendMail({ type: MailTypeEnum.welcome, email: user.email });
      return await this.signJWT(user._id);
    }

    if (!findUser.provider) {
      throw new BadRequestException({ message: 'Your account is not OAuth' });
    }

    return await this.signJWT(findUser._id);
  }
}
