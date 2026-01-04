import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Category } from '../category/entities/category.entity';
import { ShowcaseProducts } from '../shop/entities/showcase-products.entity';
import { ProductParam } from './entities/product-param.entity';
import { Param } from './entities/param.entity';
import { RequiredParam } from '../category/entities/required-param.entity';

@Module({
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
  imports: [
    TypeOrmModule.forFeature([
      Product,
      Category,
      ShowcaseProducts,
      ProductParam,
      Param,
      RequiredParam,
    ]),
  ],
})
export class ProductModule {}
