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

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @UsePipes(new ValidationPipe())
  create(@Request() { user }, @Body() dto: CreateWishDto) {
    return this.wishesService.create(user.id, dto);
  }

  @Get('last')
  findLast() {
    return this.wishesService.findLast();
  }

  @Get('top')
  findTop() {
    return this.wishesService.findTop();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.wishesService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @UsePipes(new ValidationPipe())
  update(
    @Param('id') id: number,
    @Body() dto: UpdateWishDto,
    @Request() { user },
  ) {
    return this.wishesService.update(id, dto, user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  removeOne(@Param('id') id: number, @Request() { user }) {
    return this.wishesService.removeOne(id, user);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/copy')
  copy(@Param('id') id: number, @Request() { user }) {
    return this.wishesService.copy(id, user);
  }
}
