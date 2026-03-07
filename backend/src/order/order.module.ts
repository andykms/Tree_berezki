import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { Order } from './entities/order.entity';
import { OrderProduct } from './entities/order-product';
import { ProductModule } from '../product/product.module';

@Module({
  controllers: [OrderController],
  providers: [OrderService],
  imports: [TypeOrmModule.forFeature([Order, OrderProduct]), ProductModule],
})
export class OrderModule {}
