import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { genSaltSync, hashSync } from 'bcrypt';

import { CreateUserDto } from './dto/create-users.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  private hashPassword(password: string) {
    return hashSync(password, genSaltSync(10));
  }

  private async existUser(username: string, email: string) {
    const existUsername = await this.userRepository.findOne({
      where: { username },
    });
    const existEmail = await this.userRepository.findOne({ where: { email } });

    if (existUsername || existEmail) return true;

    return false;
  }

  async create(dto: CreateUserDto) {
    const existUser = await this.existUser(dto.username, dto.email);

    if (existUser)
      throw new BadRequestException(
        'Пользователь с таким email или username уже зарегистрирован',
      );

    const { password, ...user } = await this.userRepository.save({
      username: dto.username,
      about: dto.about,
      avatar: dto.avatar,
      email: dto.email,
      password: this.hashPassword(dto.password),
    });
    return user;
  }
}
