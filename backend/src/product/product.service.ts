import {
  Injectable,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { Category } from '../category/entities/category.entity';
import { ShowcaseProducts } from '../shop/entities/showcase-products.entity';
import { ProductParam } from './entities/product-param.entity';
import { Param } from './entities/param.entity';
import { RequiredParam } from '../category/entities/required-param.entity';
import { GetProductQueryDto } from './dto/get-products.dto';
import { IGetProductResponse } from './dto/get-product-response.dto';
import { GetProductsResponseDto } from './dto/get-products-response.dto';
import { CreateProductParamDto } from './dto/create-product.dto';
import { SelectQueryBuilder } from 'typeorm/browser';
import { GetShowcaseProductResponseDto } from './dto/get-showcase-repsponse.dto';

export enum TSorts {
  'ASC',
  'DESC',
}

export type TParamWithValue = {
  param: Param;
  value: string;
};

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(ShowcaseProducts)
    private readonly showcaseProductsRepository: Repository<ShowcaseProducts>,
    @InjectRepository(ProductParam)
    private readonly productParamRepository: Repository<ProductParam>,
    @InjectRepository(Param)
    private readonly paramRepository: Repository<Param>,
    @InjectRepository(RequiredParam)
    private readonly requiredParamRepository: Repository<RequiredParam>,
  ) {}

  async create(
    createProductDto: CreateProductDto,
  ): Promise<GetProductsResponseDto> {
    const showcaseId = createProductDto.showcaseId;
    const categoryId = createProductDto.categoryId;

    // ищем группу товаров, что она действительно существует, а также чтобы создать продукт
    const showcaseProducts =
      await this.showcaseProductsRepository.findOneOrFail({
        where: { id: showcaseId },
      });

    //ищем все обязательные параметры категории
    const requiredParams = await this.requiredParamRepository.find({
      where: {
        category: {
          id: categoryId,
        },
      },
    });

    //Проверяем, что обязательные параметры заполнены
    const productParams: TParamWithValue[] = await this.__isFullRequiredParams(
      createProductDto,
      requiredParams,
    );

    const newProduct = await this.productRepository.create({
      ...createProductDto,
      category: requiredParams[0].category[0],
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

    const saved = await this.productRepository.save(newProduct);
    return this.__formatOneProductResponse(saved);
  }

  async findOne(id: string): Promise<GetProductsResponseDto> {
    const product = await this.productRepository.findOneOrFail({
      where: { id },
    });
    return this.__formatResponse([this.__productResponseAdapting(product)]);
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<GetProductsResponseDto> {
    const product = await this.productRepository.findOneOrFail({
      where: { id },
    });

    let newCategory: Category | null = updateProductDto.categoryId
      ? await this.categoryRepository.findOne({
          where: { id: updateProductDto.categoryId },
        })
      : null;

    let newShowcaseProducts: ShowcaseProducts | null =
      updateProductDto.showcaseId
        ? await this.showcaseProductsRepository.findOne({
            where: { id: updateProductDto.showcaseId },
          })
        : null;

    if (updateProductDto.params)
      await this.__patchProductParams(updateProductDto.params, product);
    if (newCategory) product.category = newCategory;
    if (newShowcaseProducts) product.showcaseProducts = newShowcaseProducts;


    await this.productRepository.save(product);

    return this.__formatOneProductResponse(product);
  }

  async remove(id: string) {
    await this.productRepository.delete(id);
    return {
      message: 'ok',
    };
  }

  async search(query: GetProductQueryDto): Promise<GetProductsResponseDto> {
    let queryBuilder = this.productRepository.createQueryBuilder('product');
    query.category &&
      queryBuilder.andWhere('product.category.path = :category', {
        category: query.category,
      });

    query.param && this.__addParamsToQueryBuilder(query.param, queryBuilder);

    query.minprice &&
      queryBuilder.andWhere('product.price_rubles >= :minprice', {
        minprice: query.minprice,
      });
    query.maxprice &&
      queryBuilder.andWhere('product.price_rubles <= :maxprice', {
        maxprice: query.maxprice,
      });
    query.shop && this.__addShopsToQueryBuilder(query.shop, queryBuilder);

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

    return this.__formatManyProductsResponse(products);
  }

  async findShowcase(id: string): Promise<GetShowcaseProductResponseDto> {
    const showcase = await this.showcaseProductsRepository.findOneOrFail({
      where: { id },
    });
    return {
      ...showcase,
      products: this.__formatManyProductsResponse(showcase.products),
    };
  }

  private __productResponseAdapting(product: Product): IGetProductResponse {
    return {
      ...product,
      comments_count: product.comments.length,
      question_count: product.questions.length,
      shop_name: product.showcaseProducts.shop.name,
      showcaseProductsId: product.showcaseProducts.id,
      params: product.params.map((param) => ({
        id: param.id,
        value: param.value,
        measure: param.param.measure.value,
        name: param.param.name,
        is_choosen: param.param.is_choosen,
      })),
      category: product.category.path,
    };
  }

  private __formatResponse(items: IGetProductResponse[]) {
    return {
      items,
      total: items.length,
    };
  }

  private async __isFullRequiredParams(
    createProductDto: CreateProductDto,
    requiredParams: RequiredParam[],
  ): Promise<TParamWithValue[]> {
    const requiredParamNames: { [key: string]: boolean } = {};
    requiredParams.forEach((param) => {
      requiredParamNames[param.name] = false;
    });

    const productParams: { param: Param; value: string }[] = [];

    for (const param of createProductDto.params) {
      const paramEntity = await this.paramRepository.findOneOrFail({
        where: { id: param.paramId },
      });
      requiredParamNames[paramEntity.name] = true;
      productParams.push({ param: paramEntity, value: param.value });
    }

    if (Object.values(requiredParamNames).some((value) => !value)) {
      throw new BadRequestException(
        'не все обязательные параметры категории указаны',
      );
    }

    return productParams;
  }

  private __formatOneProductResponse(product: Product): GetProductsResponseDto {
    return this.__formatResponse([this.__productResponseAdapting(product)]);
  }

  private __formatManyProductsResponse(
    products: Product[],
  ): GetProductsResponseDto {
    return this.__formatResponse(
      products.map((product) => this.__productResponseAdapting(product)),
    );
  }

  private async __patchProductParams(
    params: CreateProductParamDto[],
    product: Product,
  ): Promise<void> {
    const newParams: TParamWithValue[] = [];
    for (const param of params) {
      const paramEntity = await this.paramRepository.findOneOrFail({
        where: { id: param.paramId },
      });
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

  private __addParamsToQueryBuilder(
    queryParams: string,
    queryBuilder: SelectQueryBuilder<Product>,
  ): SelectQueryBuilder<Product> {
    const packedParams: { [key: string]: string[] } = {};

    const peerParams = queryParams.split(',');
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
    return queryBuilder;
  }

  private __addShopsToQueryBuilder(
    queryShops: string,
    queryBuilder: SelectQueryBuilder<Product>,
  ): SelectQueryBuilder<Product> {
    const shops = queryShops.split(',');
    queryBuilder.andWhere('product.showcaseProducts.shop.name IN (:shops)', {
      shops,
    });
    return queryBuilder;
  }
}
