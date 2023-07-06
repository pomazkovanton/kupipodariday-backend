import {
  Controller,
  Post,
  Body,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Request,
  Get,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';

import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateWishDto } from './dto/update-wish.dto';
import { TUserRequest } from 'src/common/types';
import { Wish } from './entities/wish.entity';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @UsePipes(new ValidationPipe())
  create(
    @Request() { user }: TUserRequest,
    @Body() dto: CreateWishDto,
  ): Promise<Wish> {
    return this.wishesService.create(user.id, dto);
  }

  @Get('last')
  findLast(): Promise<Wish[]> {
    return this.wishesService.findLast();
  }

  @Get('top')
  findTop(): Promise<Wish[]> {
    return this.wishesService.findTop();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: number): Promise<Wish> {
    return this.wishesService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @UsePipes(new ValidationPipe())
  update(@Param('id') id: number, @Body() dto: UpdateWishDto): Promise<Wish> {
    return this.wishesService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  removeOne(
    @Param('id') id: number,
    @Request() { user }: TUserRequest,
  ): Promise<Wish> {
    return this.wishesService.removeOne(id, user);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/copy')
  copy(
    @Param('id') id: number,
    @Request() { user }: TUserRequest,
  ): Promise<Wish> {
    return this.wishesService.copy(id, user);
  }
}
