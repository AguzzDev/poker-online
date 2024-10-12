import { Module, OnModuleInit } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/modules/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { MissionModule } from '../mission/mission.module';
import { UserService } from '../user/user.service';

@Module({
  imports: [
    UserModule,
    MissionModule,
    ConfigModule.forRoot(),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '60d' },
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule implements OnModuleInit {
  constructor(private readonly usersService: UserService) {}

  async onModuleInit() {
    //   await this.usersService.createUser({
    //     username: 'test',
    //     email: 'test2@test.com',
    //     password: '123456',
    //   });
  }
}
