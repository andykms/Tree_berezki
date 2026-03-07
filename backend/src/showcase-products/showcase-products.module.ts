import { Module } from '@nestjs/common';
import { ShowcaseProductsService } from './showcase-products.service';
import { ShowcaseProductsController } from './showcase-products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShowcaseProducts } from './entities/showcase-products.entity';
import { ShopModule } from '../shop/shop.module';

@Module({
  imports: [TypeOrmModule.forFeature([ShowcaseProducts]), ShopModule],
  controllers: [ShowcaseProductsController],
  providers: [ShowcaseProductsService],
  exports: [ShowcaseProductsService],
})
export class ShowcaseProductsModule {}
