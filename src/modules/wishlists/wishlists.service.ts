import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { Wishlist } from './entities/wishlist.entity';
import { UsersService } from '../users/users.service';
import { WishesService } from '../wishes/wishes.service';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private readonly wishlistRepository: Repository<Wishlist>,
    private readonly usersService: UsersService,
    private readonly wishesService: WishesService,
  ) {}

  findAll(): Promise<Wishlist[]> {
    return this.wishlistRepository.find({
      relations: ['owner', 'items'],
    });
  }

  async create(dto: CreateWishlistDto, userId: number): Promise<Wishlist> {
    const user = await this.usersService.findOneById(userId);
    const wishes = await this.wishesService.findMany(dto.itemsId);

    return this.wishlistRepository.save({ ...dto, owner: user, items: wishes });
  }

  async findOne(id: number): Promise<Wishlist> {
    const wishlist = await this.wishlistRepository.findOne({
      where: { id },
      relations: ['owner', 'items'],
    });

    if (!wishlist) throw new BadRequestException('No wishlist found');

    return wishlist;
  }

  async update(id: number, dto: UpdateWishlistDto, userId): Promise<Wishlist> {
    const wishlist = await this.findOne(id);

    if (wishlist.owner.id !== userId) {
      throw new BadRequestException(
        "You can't change other people's wishlists",
      );
    }
    if (dto.itemsId) {
      const { itemsId, ...restDto } = dto;
      const wishes = await this.wishesService.findMany(itemsId);
      wishlist.items.push(...wishes);
      await this.wishlistRepository.save(wishlist);
      await this.wishlistRepository.update(id, restDto);
    } else {
      await this.wishlistRepository.update(id, dto);
    }

    return wishlist;
  }

  async removeOne(id: number, userId: number): Promise<Wishlist> {
    const wishlist = await this.findOne(id);
    if (wishlist.owner.id !== userId) {
      throw new BadRequestException(
        "You can't remove other people's wishlists",
      );
    }
    await this.wishlistRepository.delete(id);
    return wishlist;
  }
}
