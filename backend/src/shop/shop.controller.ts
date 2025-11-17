import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { ShopService } from './shop.service';
import { CreateShopDto } from './dto/create-shop.dto';
import { UpdateShopDto } from './dto/update-shop.dto';
import { UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { ShopGuard } from '../auth/guards/shop.guard';
import { CreateShowcaseProductDto } from './dto/create-showcase-product.dto';

@Controller('shop')
export class ShopController {
  constructor(private readonly shopService: ShopService) {}

  @Post()
  create(@Body() createShopDto: CreateShopDto, @Req() req) {
    return this.shopService.create(createShopDto, req.user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.shopService.findOne(id);
  }

  @UseGuards(JwtGuard)
  @UseGuards(ShopGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateShopDto: UpdateShopDto) {
    return this.shopService.update(id, updateShopDto);
  }

  @UseGuards(JwtGuard)
  @UseGuards(ShopGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.shopService.remove(id);
  }

  @UseGuards(JwtGuard)
  @UseGuards(ShopGuard)
  @Post(':id/showcase')
  createShowcase(
    @Param('id') id: string,
    @Body() showcaseDto: CreateShowcaseProductDto,
  ) {
    return this.shopService.createShowcaseProduct(id, showcaseDto);
  }

  @UseGuards(JwtGuard)
  @UseGuards(ShopGuard)
  @Delete(':id/showcase/:showcaseId')
  removeShowcase(
    @Param('id') id: string,
    @Param('showcaseId') showcaseId: string,
  ) {
    return this.shopService.removeShowcaseProduct(id, showcaseId);
  }
}
