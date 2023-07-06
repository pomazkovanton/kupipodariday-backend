import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  Param,
} from '@nestjs/common';

import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TUserRequest } from 'src/common/types';
import { Offer } from './entities/offer.entity';

@UseGuards(JwtAuthGuard)
@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Post()
  create(
    @Body() dto: CreateOfferDto,
    @Request() { user }: TUserRequest,
  ): Promise<Offer> {
    return this.offersService.create(dto, user.id);
  }

  @Get()
  findAll(): Promise<Offer[]> {
    return this.offersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Offer> {
    return this.offersService.findOne(id);
  }
}
