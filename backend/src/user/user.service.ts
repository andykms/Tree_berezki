import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = await this.userRepository.create({
      ...createUserDto,
      sessions: [],
    });
    return await this.userRepository.save(user);
  }

  async findByPhone(phone: string) {
    const user = await this.userRepository.findOneOrFail({
      where: { phone },
      select: ['password'],
      relations: ['accounts', 'shops', 'sessions'],
    });
    return user;
  }

  findAll() {
    return `This action returns all user`;
  }

  async findOne(id: string, relations?: string[]) {
    const user = await this.userRepository.findOneOrFail({
      where: { id },
      relations,
    });
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOneOrFail({ where: { id } });
    const newUser = this.userRepository.merge(user, updateUserDto);
    await this.userRepository.save(newUser);
    return newUser;
  }

  remove(id: string) {
    return `This action removes a #${id} user`;
  }
}
