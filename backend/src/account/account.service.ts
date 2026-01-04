import { Injectable, BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from './entities/account.entity';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { User } from '../user/entities/user.entity';


@Injectable()
export class AccountService {

  constructor(
    @InjectRepository(Account) private readonly accountRepository: Repository<Account>,
  ) {}

  async create(createAccountDto: CreateAccountDto, user: User) {
    const account = await this.accountRepository.create({...createAccountDto, user});
    return await this.accountRepository.save(account);
  }

  async findOne(id: string) {
    return this.accountRepository.findOneOrFail({where: {id}});
  }

  async update(id: string, updateAccountDto: UpdateAccountDto) {
    const account = await this.accountRepository.findOneOrFail({where: {id}});
    await this.accountRepository.save({...account, ...updateAccountDto});
    return await this.accountRepository.findOneOrFail({where: {id}});
  }

  async remove(id: string) {
    const account = await this.accountRepository.findOneOrFail({where: {id}});
    for(const order of account.orders) {
      if(order.status !== 'delivered') {
        throw new BadRequestException('Нельзя удалить аккаунт с незавершенными заказами');
      }
    }
    await this.accountRepository.delete({id});
    return account;
  }
}
