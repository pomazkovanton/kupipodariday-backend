import { BadRequestException, Injectable } from '@nestjs/common';
import { In, Repository } from 'typeorm';

import { CreateWishDto } from './dto/create-wish.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wish } from './entities/wish.entity';
import { UsersService } from '../users/users.service';
import { UpdateWishDto } from './dto/update-wish.dto';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish) private readonly wishRepository: Repository<Wish>,
    private readonly userService: UsersService,
  ) {}

  async create(id: number, dto: CreateWishDto): Promise<Wish> {
    const user = await this.userService.findOneById(id);
    return this.wishRepository.save({
      ...dto,
      owner: user,
    });
  }

  findLast(): Promise<Wish[]> {
    return this.wishRepository.find({
      order: { createdAt: 'DESC' },
      take: 40,
      relations: ['owner', 'offers'],
    });
  }

  findTop(): Promise<Wish[]> {
    return this.wishRepository.find({
      take: 10,
      order: { copied: 'desc' },
      relations: ['owner', 'offers'],
    });
  }

  async findOne(id: number): Promise<Wish> {
    const wish = await this.wishRepository.findOne({
      where: { id },
      relations: ['owner', 'offers', 'offers.user'],
    });
    if (!wish) throw new BadRequestException('No gift found');
    return wish;
  }

  async update(wishId: number, dto: UpdateWishDto): Promise<Wish> {
    const wish = await this.findOne(wishId);
    if (dto.price && wish.offers.length > 0)
      throw new BadRequestException(
        'It is not possible to change the value of the gift',
      );
    await this.wishRepository.update(wishId, dto);
    return this.findOne(wishId);
  }

  async removeOne(wishId: number, user): Promise<Wish> {
    const wish = await this.findOne(wishId);

    if (user && wish.owner.id !== user.id) {
      throw new BadRequestException('No gift found');
    }
    if (wish.offers.length > 0)
      throw new BadRequestException(
        'You cannot delete a gift for which a donation has been started',
      );
    await this.wishRepository.delete(wishId);
    return wish;
  }

  async copy(wishId: number, user): Promise<Wish> {
    const { id, createdAt, updatedAt, copied, raised, offers, ...dataWish } =
      await this.findOne(wishId);
    const owner = await this.userService.findOneById(user.id);
    await this.wishRepository.update(id, { copied: copied + 1 });
    return this.wishRepository.save({
      ...dataWish,
      owner,
    });
  }

  findMany(giftsId: number[]): Promise<Wish[]> {
    return this.wishRepository.find({
      where: { id: In(giftsId) },
    });
  }
}
