import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { AccountGuard } from '../auth/guards/account.guard';
import { GetOrdersQueryDto } from './dto/get-orders.dto';
import { UpdateOrderByUserDto } from './dto/update-by-user-order.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(JwtGuard)
  @UseGuards(AccountGuard)
  @Post()
  async create(@Body() createOrderDto: CreateOrderDto, @Req() req) {
    return await this.orderService.create(createOrderDto, req.user);
  }

  @UseGuards(JwtGuard)
  @Get()
  async findAll(@Query() query: GetOrdersQueryDto) {
    return await this.orderService.findAll(query);
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.orderService.findOne(id);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return await this.orderService.update(id, updateOrderDto);
  }

  @UseGuards(JwtGuard)
  @UseGuards(AccountGuard)
  @Patch('change/:id')
  async updateByUser(
    @Param('id') id: string,
    @Body() updateOrderByUserDto: UpdateOrderByUserDto,
  ) {
    return await this.orderService.updateByUser(id, updateOrderByUserDto);
  }
}
