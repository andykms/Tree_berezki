import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateBasketDto } from './dto/create-basket.dto';
import { DeleteBasketDto } from './dto/delete-basket.dto';
import { User } from '../user/entities/user.entity';
import { Basket } from './entities/basket.entity';
import { GetBasketQueryDto } from './dto/get-basket.dto';

@Injectable()
export class BasketService {
  constructor(
    @InjectRepository(Basket) private basketRepository: Repository<Basket>,
  ) {}

  async create(createBasketDto: CreateBasketDto, user: User) {
    const account = user.accounts.find(
      (account) => account.id === createBasketDto.accountId,
    );

    const basket = await this.basketRepository.findOne({
      where: {
        account: account,
        product: {
          id: createBasketDto.productId,
        },
      },
    });

    if (basket) {
      basket.quantity = createBasketDto.quantity;
      await this.basketRepository.save(basket);
      return basket;
    }

    const newBasket = await this.basketRepository.create({
      account: account,
      product: {
        id: createBasketDto.productId,
      },
      quantity: createBasketDto.quantity || 1,
    });

    return await this.basketRepository.save(newBasket);
  }

  async findAll(getBasketQueryDto: GetBasketQueryDto, user: User) {
    const limit = Number(getBasketQueryDto.limit);
    const page = Number(getBasketQueryDto.page);

    const account = user.accounts.find(
      (account) => account.id === getBasketQueryDto.accountId,
    );
    const basket = await this.basketRepository.find({
      where: {
        account,
      },
      relations: ['product'],
      skip: limit * page,
      take: limit,
    });

    return {
      items: basket,
      total: basket.length,
    };
  }

  async remove(deleteBasketDto: DeleteBasketDto, user: User) {
    const account = user.accounts.find(
      (account) => account.id === deleteBasketDto.accountId,
    );
    await this.basketRepository.delete({
      account: account,
      product: {
        id: deleteBasketDto.productId,
      },
    });

    return {
      message: 'ok',
    };
  }
}
