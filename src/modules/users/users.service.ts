import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { genSaltSync, hashSync } from 'bcrypt';

import { CreateUserDto } from './dto/create-users.dto';
import { User } from './entities/user.entity';
import { UpdateUsersDto } from './dto/update-users.dto';

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

  async save(dto: CreateUserDto) {
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
      password: this.hashPassword(dto.password),
    });
    return user;
  }

  async findOne(searchIndex: string) {
    return this.userRepository.findOne({
      where: [{ email: searchIndex }, { username: searchIndex }],
    });
  }

  async findOneById(id: number) {
    const { password, ...user } = await this.userRepository.findOne({
      where: { id },
    });
    return user;
  }

  async update(id: number, dto: UpdateUsersDto) {
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
      dto.password = this.hashPassword(dto.password);
    }

    await this.userRepository.update(id, dto);
    return this.findOneById(id);
  }
}
