import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { Category } from '../category/entities/category.entity';
import { ShowcaseProducts } from '../shop/entities/showcase-products.entity';
import { Repository } from 'typeorm';
import { ProductParam } from './entities/product-param.entity';
import { Param } from './entities/param.entity';
import { RequiredParam } from '../category/entities/required-param.entity';
import { GetProductQueryDto } from './dto/get-products.dto';

export enum TSorts {
  'ASC',
  'DESC',
}

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepository: Repository<Product>,
    private readonly categoryRepository: Repository<Category>,
    private readonly showcaseProductsRepository: Repository<ShowcaseProducts>,
    private readonly productParamRepository: Repository<ProductParam>,
    private readonly paramRepository: Repository<Param>,
    private readonly requiredParamRepository: Repository<RequiredParam>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const showcaseId = createProductDto.showcaseId;
    const categoryId = createProductDto.categoryId;

    // ищем категорию, что она действительно существует, а также чтобы создать продукт
    const category = await this.categoryRepository.findOne({
      where: { id: categoryId },
    });

    // ищем группу товаров, что она действительно существует, а также чтобы создать продукт
    const showcaseProducts = await this.showcaseProductsRepository.findOne({
      where: { id: showcaseId },
    });

    //если у продукта нет категории, то выбрасываем ошибку
    if (!category) {
      throw new BadRequestException('категория не найдена');
    }

    //если у продукта нет группы товаров, то выбрасываем ошибку
    if (!showcaseProducts) {
      throw new BadRequestException('группа товаров не найдена');
    }

    //ищем все обязательные параметры категории
    const requiredParams = await this.requiredParamRepository.find({
      where: { category },
    });

    /*создаем объект с ключами названиями обязательных параметров и значениями false, 
    
    это нужно, чтобы при переборе указанных в запросе параметров, если указанный
    параметр это обязательный параметр категории, то чтобы
    каждый раз не проходиться по массиву обязательных параметров за O(n), сделать это 
    за O(1) из-за использования хеш-таблицы. 
    Если хотя бы один обязательный параметр в категории не указан, то выбрасываем ошибку*/
    const requiredParamNames: { [key: string]: boolean } = {};
    requiredParams.forEach((param) => {
      requiredParamNames[param.name] = false;
    });

    const productParams: { param: Param; value: string }[] = [];

    for (const param of createProductDto.params) {
      const paramEntity = await this.paramRepository.findOne({
        where: { id: param.paramId },
      });
      if (!paramEntity) {
        throw new BadRequestException('параметр не найден');
      }
      requiredParamNames[paramEntity.name] = true;
      productParams.push({ param: paramEntity, value: param.value });
    }

    if (Object.values(requiredParamNames).some((value) => !value)) {
      throw new BadRequestException(
        'не все обязательные параметры категории указаны',
      );
    }

    const newProduct = await this.productRepository.create({
      ...createProductDto,
      category,
      showcaseProducts,
    });

    //Сохраняем параметры товара в базу данных через связную таблицу между Product и Param.
    for (const param of productParams) {
      const productParam = await this.productParamRepository.create({
        value: param.value,
        param: param.param,
        product: newProduct,
      });
      await this.productParamRepository.save(productParam);
    }

    return await this.productRepository.save(newProduct);
  }

  findOne(id: string) {
    return this.productRepository.findOne({ where: { id } });
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product | null> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new BadRequestException('товар не найден');
    }

    let newCategory: Category | undefined = undefined;
    let newShowcaseProducts: ShowcaseProducts | undefined = undefined;
    let newParams: { param: Param; value: string }[] = [];

    if (updateProductDto.categoryId) {
      const category = await this.categoryRepository.findOne({
        where: { id: updateProductDto.categoryId },
      });
      if (!category) {
        throw new BadRequestException('категория не найдена');
      }
      newCategory = category;
    }
    if (updateProductDto.showcaseId) {
      const showcaseProducts = await this.showcaseProductsRepository.findOne({
        where: { id: updateProductDto.showcaseId },
      });
      if (!showcaseProducts) {
        throw new BadRequestException('группа товаров не найдена');
      }
      newShowcaseProducts = showcaseProducts;
    }
    if (updateProductDto.params) {
      for (const param of updateProductDto.params) {
        const paramEntity = await this.paramRepository.findOne({
          where: { id: param.paramId },
        });
        if (!paramEntity) {
          throw new BadRequestException('параметр не найден');
        }
        newParams.push({ param: paramEntity, value: param.value });
      }

      for (const newParam of newParams) {
        const oldParam = await this.productParamRepository.find({
          where: { param: newParam.param, product },
        });
        if (oldParam.length > 0) {
          await this.productParamRepository.update(oldParam[0].id, {
            value: newParam.value,
          });
        } else {
          const productParam = await this.productParamRepository.create({
            value: newParam.value,
            param: newParam.param,
            product,
          });
          await this.productParamRepository.save(productParam);
        }
      }
    }

    await this.productRepository.update(id, updateProductDto);
    if (newCategory) {
      await this.productRepository.update(id, { category: newCategory });
    }
    if (newShowcaseProducts) {
      await this.productRepository.update(id, {
        showcaseProducts: newShowcaseProducts,
      });
    }
    const newProduct = await this.productRepository.findOne({ where: { id } });
    return newProduct;
  }

  async remove(id: string) {
    return await this.productRepository.delete(id);
  }

  async search(query: GetProductQueryDto) {
    const queryBuilder = this.productRepository.createQueryBuilder('product');
    if (query.category) {
      queryBuilder.andWhere('product.category.path = :category', {
        category: query.category,
      });
    }
    const packedParams: { [key: string]: string[] } = {};

    if (query.param) {
      const peerParams = query.param.split(',');
      for (const peerParam of peerParams) {
        const peer = peerParam.split(':');
        const param = peer[0];
        const value = peer[1];
        packedParams[param] = packedParams[param] || [];
        packedParams[param].push(value);
      }

      const params = Object.keys(packedParams);
      for (const param of params) {
        queryBuilder.andWhere(
          'product.params.param.name = :param AND product.params.value IN (:values)',
          {
            param,
            values: packedParams[param],
          },
        );
      }
    }
    if (query.minprice) {
      queryBuilder.andWhere('product.price_rubles >= :minprice', {
        minprice: query.minprice,
      });
    }
    if (query.maxprice) {
      queryBuilder.andWhere('product.price_rubles <= :maxprice', {
        maxprice: query.maxprice,
      });
    }
    if (query.shop) {
      const shops = query.shop.split(',');
      queryBuilder.andWhere('product.showcaseProducts.shop.name IN (:shops)', {
        shops,
      });
    }

    if (query.sortBy) {
      switch (query.sortBy) {
        case 'minprice':
          queryBuilder.orderBy('product.price_rubles', 'ASC');
          break;
        case 'maxprice':
          queryBuilder.orderBy('product.price_rubles', 'DESC');
          break;
        case 'popular':
          queryBuilder.orderBy('product.purchase_count', 'DESC');
          break;
        case 'new':
          queryBuilder.orderBy('product.created_at', 'DESC');
          break;
      }
    }
    queryBuilder
      .skip((Number(query.page) - 1) * Number(query.limit))
      .take(Number(query.limit));
    const products = await queryBuilder.getMany();
    return {
      items: products,
      total: products.length,
    };
  }
}
