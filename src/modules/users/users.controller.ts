import {
  Controller,
  Post,
  Body,
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
import { TUser, TUserRequest } from 'src/common/types';
import { Wish } from '../wishes/entities/wish.entity';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  findOwn(@Request() { user }: TUserRequest): Promise<TUser> {
    return this.usersService.findOneById(user.id);
  }

  @Patch('me')
  update(
    @Request() { user }: TUserRequest,
    @Body() dto: UpdateUsersDto,
  ): Promise<TUser> {
    return this.usersService.update(user.id, dto);
  }

  @Get('me/wishes')
  getOwnWishes(@Request() { user }: TUserRequest): Promise<Wish[]> {
    return this.usersService.getWishes(user.username);
  }

  @Get(':username')
  async getOne(@Param('username') username: string): Promise<TUser> {
    const user = await this.usersService.findOne(username);
    if (!user) throw new BadRequestException('User not found');
    return user;
  }

  @Get(':username/wishes')
  async getWishes(@Param('username') username: string): Promise<Wish[]> {
    return this.usersService.getWishes(username);
  }

  @Post('find')
  async findMany(@Body() dto: FindUserDto): Promise<TUser[]> {
    return this.usersService.find(dto);
  }
}
