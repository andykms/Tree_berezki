import {
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateShopDto } from './dto/create-shop.dto';
import { UpdateShopDto } from './dto/update-shop.dto';
import { Shop } from './entities/shop.entity';
import { User } from '../user/entities/user.entity';
import { CreateShowcaseProductDto } from './dto/create-showcase-product.dto';
import { GetShopsResponseDto } from './dto/get-shops-reponse.dto';
import { IGetShopResponse } from './dto/get-shop-response.dto';

@Injectable()
export class ShopService {
  constructor(
    @InjectRepository(Shop) private readonly shopRepository: Repository<Shop>
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

  async findOne(id: string): Promise<GetShopsResponseDto> {
    const finded = await this.shopRepository.findOneOrFail({ where: { id } });
    return this.__formatOneShopResponse(finded);
  }

  async update(
    id: string,
    updateShopDto: UpdateShopDto,
  ): Promise<GetShopsResponseDto> {
    const shop = await this.shopRepository.findOneOrFail({ where: { id } })
    await this.shopRepository.save({
      ...shop,
      ...updateShopDto,
    })
    return this.__formatOneShopResponse(await this.shopRepository.findOneOrFail({ where: { id } }));
  }

  async remove(id: string) {
    await this.shopRepository.findOneOrFail({ where: { id } });
    await this.shopRepository.delete(id);
    return {
      message: "ok"
    }
  }

  async createShowcaseProduct(
    id: string,
    showcaseProduct: CreateShowcaseProductDto,
  ) {
    const shop = await this.shopRepository.findOneOrFail({ where: { id } });
    await this.shopRepository.update(id, {
      showcaseProducts: [...shop.showcaseProducts, showcaseProduct],
    });
    return await this.shopRepository.save(shop);
  }

  async removeShowcaseProduct(id: string, showcaseId: string) {
    const shop = await this.shopRepository.findOneOrFail({ where: { id } });
    await this.shopRepository.update(id, {
      showcaseProducts: shop.showcaseProducts.filter(
        (showcase) => showcase.id !== showcaseId,
      ),
    });
    return await this.shopRepository.save(shop);
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

  private __formatManyShopsResponse(shops: Shop[]): GetShopsResponseDto {
    return this.__formatResponse(
      shops.map((shop) => this.__shopResponseAdapting(shop)),
    );
  }
}
