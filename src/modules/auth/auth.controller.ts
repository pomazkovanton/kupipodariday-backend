import { Body, Controller, Post, UseGuards, Request } from '@nestjs/common';

import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { TToken, TUser } from 'src/common/types';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(@Body() dto: SignUpDto): Promise<TUser> {
    return this.authService.signup(dto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  signin(@Request() req: { user: TUser }): Promise<TToken> {
    return this.authService.signin(req.user);
  }
}
