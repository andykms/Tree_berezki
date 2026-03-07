import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Category } from '../category/entities/category.entity';
import { ShowcaseProducts } from '../showcase-products/entities/showcase-products.entity';
import { ProductParam } from './entities/product-param.entity';
import { Param } from '../param/entities/param.entity';
import { FileMoveModule } from '../file-move/file-move.module';
import { ProductImage } from './entities/product-image.entity';
import { Measure } from '../measure/entities/measure.entity';
import { ParamModule } from '../param/param.module';

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
      ProductImage,
      Measure,
    ]),
    FileMoveModule,
    ParamModule,
  ],
})
export class ProductModule {}
