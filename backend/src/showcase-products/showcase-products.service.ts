import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateShowcaseProductDto } from './dto/create-showcase-product.dto';
import { UpdateShowcaseProductDto } from './dto/update-showcase-product.dto';
import { ShowcaseProducts } from './entities/showcase-products.entity';
import { ShopService } from '../shop/shop.service';

@Injectable()
export class ShowcaseProductsService {
  @Inject(ShopService) private readonly shopService: ShopService;

  constructor(
    @InjectRepository(ShowcaseProducts)
    private readonly showcaseProductsRepository: Repository<ShowcaseProducts>,
  ) {}

  async createShowcaseProduct(
    id: string,
    showcaseProduct: CreateShowcaseProductDto,
  ) {
    const shop = await this.shopService.findOne(id, ['showcaseProducts']);
    const showcase = this.showcaseProductsRepository.create({
      shop,
      ...showcaseProduct,
    });
    await this.showcaseProductsRepository.save(showcase);
    return shop;
  }

  async removeShowcaseProduct(id: string, showcaseId: string) {
    const shop = await this.shopService.findOne(id, ['showcaseProducts']);
    const showcase = shop.showcaseProducts.find(
      (showcase) => showcase.id === showcaseId,
    );
    if (!showcase) {
      throw new NotFoundException(
        `Showcase product with id ${showcaseId} not found`,
      );
    }
    await this.showcaseProductsRepository.remove(showcase);
    return {
      message: 'ok',
    };
  }

  async getShowcaseProducts(id: string) {
    const shop = await this.shopService.findOne(id, ['showcaseProducts']);
    const showcaseProducts = shop.showcaseProducts;
    return {
      items: showcaseProducts,
      total: showcaseProducts.length,
    };
  }
}
