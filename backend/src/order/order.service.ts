import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';
import { OrderProduct } from './entities/order-product';
import { Product } from '../product/entities/product.entity';
import { User } from '../user/entities/user.entity';
import { UpdateOrderByUserDto } from './dto/update-by-user-order.dto';
import { EOrderStatus } from './entities/order.entity';
import { GetOrdersQueryDto } from './dto/get-orders.dto';
import { ProductService } from '../product/product.service';

@Injectable()
export class OrderService {

  @Inject(ProductService)
  private readonly productService: ProductService;

  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderProduct)
    private readonly orderProductRepository: Repository<OrderProduct>,
  ) {}

  async create(createOrderDto: CreateOrderDto, user: User) {
    const orderProducts = createOrderDto.products;
    let realTotal = 0;

    const products: Product[] = [];

    for (const product of orderProducts) {
      const productEntity = await this.productService.findOne(product.productId);

      realTotal +=
        productEntity.price_rubles *
        (1 - productEntity.discount / 100) *
        product.count;
      products.push(productEntity);
    }

    if (Math.abs(realTotal - createOrderDto.total) >= 0.01) {
      throw new BadRequestException('сумма не совпадает');
    }

    const order = await this.orderRepository.create({
      ...createOrderDto,
      total: realTotal,
      account: user.accounts.find(
        (account) => account.id === createOrderDto.accountId,
      ),
    });

    for (const product of products) {
      const newOrderProduct = await this.orderProductRepository.create({
        ...product,
        count: product.count,
        order,
        shopName: product.showcaseProducts.shop.name,
        imageUrl: product.images[0].url,
      });
      await this.orderProductRepository.save(newOrderProduct);
    }

    return await this.orderRepository.save(order);
  }

  async findAll(query: GetOrdersQueryDto, user: User) {
    const limit = Number(query.limit) || 10;
    const page = Number(query.page) || 1;

    const account = user.accounts.find(
      (account) => account.id === query.accountId,
    );

    const orders = await this.orderRepository.find({
      where: { account },
      take: limit,
      skip: page * limit,
      order: { created_at: 'DESC' },
    });
    return {
      items: orders,
      total: orders.length,
    };
  }

  async findOne(id: string) {
    return await this.orderRepository.findOne({ where: { id } });
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    const order = await this.orderRepository.findOneOrFail({ where: { id } });

    const newOrder = this.orderRepository.merge(order, updateOrderDto);

    return await this.orderRepository.save(newOrder);
  }

  async updateByUser(id: string, updateOrderDto: UpdateOrderByUserDto) {
    const order = await this.orderRepository.findOne({ where: { id } });
    if (!order) {
      throw new NotFoundException('заказ не найден');
    }
    if (updateOrderDto.deliveryTime) {
      if (
        order.status === EOrderStatus.CREATED ||
        order.status === EOrderStatus.PAID
      ) {
        order.deliveryTime = updateOrderDto.deliveryTime;
      } else {
        throw new BadRequestException(
          'невозможно изменить время доставки, когда заказ уже едет',
        );
      }
    }
    if (updateOrderDto.status) {
      if (
        order.status === EOrderStatus.CREATED ||
        order.status === EOrderStatus.PAID
      ) {
        order.status = updateOrderDto.status;
      } else {
        throw new BadRequestException(
          'невозможно изменить статус заказа, когда заказ уже едет',
        );
      }
    }
    if (updateOrderDto.comment) {
      if (order.status !== EOrderStatus.DELIVERED) {
        order.comment = updateOrderDto.comment;
      } else {
        throw new BadRequestException(
          'невозможно изменить комментарий, когда заказ уже доставлен',
        );
      }
    }
    await this.orderRepository.save(order);
    return order;
  }

  remove(id: string) {
    return `This action removes a #${id} order`;
  }
}
