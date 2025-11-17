import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateShopDto } from './dto/create-shop.dto';
import { UpdateShopDto } from './dto/update-shop.dto';
import { Shop } from './entities/shop.entity';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateShowcaseProductDto } from './dto/create-showcase-product.dto';
import { ProductService } from '../product/product.service';

@Injectable()
export class ShopService {
  constructor(
    private readonly shopRepository: Repository<Shop>,
    private readonly productService: ProductService,
  ) {}

  async create(createShopDto: CreateShopDto, user: User) {
    const shop = await this.shopRepository.create({ ...createShopDto, user });
    return this.shopRepository.save(shop);
  }

  findAll() {
    return `This action returns all shop`;
  }

  findOne(id: string) {
    return this.shopRepository.findOne({ where: { id } });
  }

  async update(id: string, updateShopDto: UpdateShopDto) {
    return await this.shopRepository.update(id, updateShopDto);
  }

  async remove(id: string) {
    const shop = await this.shopRepository.findOne({ where: { id } });
    if (!shop) {
      throw new NotFoundException('магазин не найден');
    }
    return await this.shopRepository.delete(id);
  }

  async createShowcaseProduct(
    id: string,
    showcaseProduct: CreateShowcaseProductDto,
  ) {
    const shop = await this.shopRepository.findOne({ where: { id } });
    if (!shop) {
      throw new NotFoundException('магазин не найден');
    }
    await this.shopRepository.update(id, {
      showcaseProducts: [...shop.showcaseProducts, showcaseProduct],
    });
    return await this.shopRepository.save(shop);
  }

  async removeShowcaseProduct(id: string, showcaseId: string) {
    const shop = await this.shopRepository.findOne({ where: { id } });
    if (!shop) {
      throw new NotFoundException('магазин не найден');
    }
    await this.shopRepository.update(id, {
      showcaseProducts: shop.showcaseProducts.filter(
        (showcase) => showcase.id !== showcaseId,
      ),
    });
    return await this.shopRepository.save(shop);
  }
}
