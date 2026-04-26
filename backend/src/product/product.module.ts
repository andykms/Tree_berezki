import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductParam } from './entities/product-param.entity';
import { FileMoveModule } from '../file-move/file-move.module';
import { ProductImage } from './entities/product-image.entity';
import { ParamModule } from '../param/param.module';
import { ShowcaseProductsModule } from '../showcase-products/showcase-products.module';
import { CategoryModule } from '../category/category.module';

@Module({
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
  imports: [
    CategoryModule,
    ShowcaseProductsModule,
    ParamModule,
    TypeOrmModule.forFeature([
      Product,
      ProductParam,
      ProductImage,
    ]),
    FileMoveModule,
  ],
})
export class ProductModule {}
