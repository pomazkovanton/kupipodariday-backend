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
  Param,
  BadRequestException,
} from '@nestjs/common';

import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateUsersDto } from './dto/update-users.dto';
import { FindUserDto } from './dto/find-user.dto';

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

  @Get('me/wishes')
  getOwnWishes(@Request() { user }) {
    return this.usersService.getWishes(user.username);
  }

  @Get(':username')
  async getOne(@Param('username') username: string) {
    const user = await this.usersService.findOne(username);
    if (!user) throw new BadRequestException('User not found');
    return user;
  }

  @Get(':username/wishes')
  async getWishes(@Param('username') username: string) {
    return this.usersService.getWishes(username);
  }

  @Post('find')
  async findMany(@Body() dto: FindUserDto) {
    return this.usersService.find(dto);
  }
}
