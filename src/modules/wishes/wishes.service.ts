import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { CreateWishDto } from './dto/create-wish.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wish } from './entities/wish.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish) private readonly wishRepository: Repository<Wish>,
    private readonly userService: UsersService,
  ) {}

  async create(id: number, dto: CreateWishDto) {
    const user = await this.userService.findOneById(id);
    return this.wishRepository.save({
      ...dto,
      owner: user,
    });
  }
}
