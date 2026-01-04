import {
  Controller,
  Get,
  Put,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query
} from '@nestjs/common';
import { BasketService } from './basket.service';
import { CreateBasketDto } from './dto/create-basket.dto';
import { GetBasketQueryDto } from './dto/get-basket.dto';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { AccountGuard } from '../auth/guards/account.guard';
import { DeleteBasketDto } from './dto/delete-basket.dto';

@Controller('basket')
export class BasketController {
  constructor(private readonly basketService: BasketService) {}

  @UseGuards(JwtGuard, AccountGuard)
  @Put()
  async create(@Body() createBasketDto: CreateBasketDto, @Req() req) {
    return await this.basketService.create(createBasketDto, req.user);
  }

  @UseGuards(JwtGuard, AccountGuard)
  @Delete()
  async remove(@Body() deleteBasketDto: DeleteBasketDto, @Req() req) {
    return await this.basketService.remove(deleteBasketDto, req.user);
  }

  @UseGuards(JwtGuard, AccountGuard)
  @Get()
  async findAll(@Query() getBasketQueryDto: GetBasketQueryDto, @Req() req) {
    return await this.basketService.findAll(getBasketQueryDto, req.user);
  }
}
