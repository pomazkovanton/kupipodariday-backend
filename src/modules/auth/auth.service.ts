import { Injectable } from '@nestjs/common';
import { compareSync } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { UsersService } from '../users/users.service';
import { SignUpDto } from './dto/sign-up.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.userService.findOne(username);

    if (!user || !compareSync(password, user.password)) return null;

    return user;
  }

  signup(dto: SignUpDto) {
    return this.userService.save(dto);
  }

  async signin(user: any) {
    const token = this.jwtService.sign({ id: user.id });
    return {
      access_token: token,
    };
  }
}
