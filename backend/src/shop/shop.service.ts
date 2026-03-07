import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateShopDto } from './dto/create-shop.dto';
import { UpdateShopDto } from './dto/update-shop.dto';
import { Shop } from './entities/shop.entity';
import { User } from '../user/entities/user.entity';
import { GetShopsResponseDto } from './dto/get-shops-reponse.dto';
import { IGetShopResponse } from './dto/get-shop-response.dto';

@Injectable()
export class ShopService {
  constructor(
    @InjectRepository(Shop) private readonly shopRepository: Repository<Shop>,
  ) {}

  async create(
    createShopDto: CreateShopDto,
    user: User,
  ): Promise<GetShopsResponseDto> {
    const createdShop = await this.shopRepository.create({
      ...createShopDto,
      user,
    });
    const savedShop = await this.shopRepository.save(createdShop);
    return this.__formatOneShopResponse(savedShop);
  }

  findAll() {
    return `This action returns all shop`;
  }

  async findOne(id: string, relations?: string[]): Promise<Shop> {
    const finded = await this.shopRepository.findOneOrFail({
      where: { id },
      relations,
    });
    return finded;
  }

  async update(
    id: string,
    updateShopDto: UpdateShopDto,
  ): Promise<GetShopsResponseDto> {
    const shop = await this.shopRepository.findOneOrFail({ where: { id } });
    const newShop = this.shopRepository.merge(shop, updateShopDto);
    await this.shopRepository.save(newShop);
    return this.__formatOneShopResponse(
      await this.shopRepository.findOneOrFail({ where: { id } }),
    );
  }

  async remove(id: string) {
    await this.shopRepository.findOneOrFail({ where: { id } });
    await this.shopRepository.delete(id);
    return {
      message: 'ok',
    };
  }

  private __shopResponseAdapting(shop: Shop): IGetShopResponse {
    return shop;
  }

  private __formatResponse(items: IGetShopResponse[]) {
    return {
      items,
      total: items.length,
    };
  }

  private __formatOneShopResponse(shop: Shop): GetShopsResponseDto {
    return this.__formatResponse([this.__shopResponseAdapting(shop)]);
  }
}
