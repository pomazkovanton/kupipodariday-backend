import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';

import { CreateUserDto } from './dto/create-users.dto';
import { User } from './entities/user.entity';
import { UpdateUsersDto } from './dto/update-users.dto';
import { FindUserDto } from './dto/find-user.dto';
import { HashService } from '../hash/hash.service';
import { TUser } from 'src/common/types';
import { Wish } from '../wishes/entities/wish.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly hashService: HashService,
  ) {}

  private async existUser(username: string, email: string): Promise<boolean> {
    const existUsername = await this.userRepository.findOne({
      where: { username },
    });
    const existEmail = await this.userRepository.findOne({ where: { email } });

    if (existUsername || existEmail) return true;

    return false;
  }

  async save(dto: CreateUserDto): Promise<TUser> {
    const existUser = await this.existUser(dto.username, dto.email);

    if (existUser)
      throw new BadRequestException(
        'A user with this email or username is already registered',
      );

    const { password, ...user } = await this.userRepository.save({
      username: dto.username,
      about: dto.about,
      avatar: dto.avatar,
      email: dto.email,
      password: this.hashService.getHash(dto.password),
    });
    return user;
  }

  async findOne(searchIndex: string): Promise<User> {
    return this.userRepository.findOne({
      where: [{ email: searchIndex }, { username: searchIndex }],
    });
  }

  async findOneById(id: number): Promise<TUser> {
    const { password, ...user } = await this.userRepository.findOne({
      where: { id },
    });
    return user;
  }

  async update(id: number, dto: UpdateUsersDto): Promise<TUser> {
    const user = await this.findOneById(id);
    if (dto.username && dto.username !== user.username) {
      const isUsernameExist = await this.findOne(dto.username);
      if (isUsernameExist)
        throw new BadRequestException(
          'A user with this username is already registered',
        );
    }
    if (dto.email && dto.email !== user.email) {
      const isEmailExist = await this.findOne(dto.email);
      if (isEmailExist)
        throw new BadRequestException(
          'A user with this email is already registered',
        );
    }
    if (dto.password) {
      dto.password = this.hashService.getHash(dto.password);
    }

    await this.userRepository.update(id, dto);
    return this.findOneById(id);
  }

  async getWishes(username: string): Promise<Wish[]> {
    const user = await this.findOne(username);
    if (!user) throw new BadRequestException('User not found');
    const { wishes } = await this.userRepository.findOne({
      where: { username },
      select: ['wishes'],
      relations: ['wishes', 'wishes.owner', 'wishes.offers'],
    });
    return wishes;
  }

  find(dto: FindUserDto): Promise<TUser[]> {
    return this.userRepository.find({
      where: [
        { username: Like(`%${dto.query}%`) },
        { email: Like(`%${dto.query}%`) },
      ],
    });
  }
}
