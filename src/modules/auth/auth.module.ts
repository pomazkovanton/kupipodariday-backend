import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

import { UsersModule } from '../users/users.module';
import { jwtOptions } from '../../configs/jwt.config';
import { STRATEGIES } from './strategies';
import { GUARDS } from './guards';

@Module({
  imports: [PassportModule, JwtModule.registerAsync(jwtOptions()), UsersModule],
  controllers: [AuthController],
  providers: [AuthService, ...STRATEGIES, ...GUARDS],
})
export class AuthModule {}
