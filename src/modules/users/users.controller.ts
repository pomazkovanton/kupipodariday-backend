import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  Request,
  UseGuards,
  Get,
  Patch,
} from '@nestjs/common';

import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateUsersDto } from './dto/update-users.dto';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  findOwn(@Request() { user }) {
    return this.usersService.findOneById(user.id);
  }

  @Patch('me')
  @UsePipes(new ValidationPipe({ skipMissingProperties: true }))
  update(@Request() { user }, @Body() dto: UpdateUsersDto) {
    return this.usersService.update(user.id, dto);
  }
}
