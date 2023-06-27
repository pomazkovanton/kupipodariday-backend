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

    if (existUsername || existEmail)
      throw new BadRequestException(
        'A user with this email or username is already registered',
      );
  }

  async save(dto: CreateUserDto) {
    const existUser = await this.existUser(dto.username, dto.email);

    const { password, ...user } = await this.userRepository.save({
      username: dto.username,
      about: dto.about,
      avatar: dto.avatar,
      email: dto.email,
      password: this.hashPassword(dto.password),
    });
    return user;
  }

  async findOne(searchIndex: string) {
    return this.userRepository.findOne({
      where: [{ email: searchIndex }, { username: searchIndex }],
    });
  }
}
