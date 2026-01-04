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
import { GetShopsResponseDto } from './dto/get-shops-reponse.dto';

@Controller('shop')
export class ShopController {
  constructor(private readonly shopService: ShopService) {}

  @Post()
  async create(@Body() createShopDto: CreateShopDto, @Req() req): Promise<GetShopsResponseDto> {
    return await this.shopService.create(createShopDto, req.user);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<GetShopsResponseDto> {
    return await this.shopService.findOne(id);
  }

  @UseGuards(JwtGuard)
  @UseGuards(ShopGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateShopDto: UpdateShopDto): Promise<GetShopsResponseDto> {
    return await this.shopService.update(id, updateShopDto);
  }

  @UseGuards(JwtGuard)
  @UseGuards(ShopGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.shopService.remove(id);
  }

  @UseGuards(JwtGuard)
  @UseGuards(ShopGuard)
  @Post(':id/showcase')
  async createShowcase(
    @Param('id') id: string,
    @Body() showcaseDto: CreateShowcaseProductDto,
  ) {
    return await this.shopService.createShowcaseProduct(id, showcaseDto);
  }

  @UseGuards(JwtGuard)
  @UseGuards(ShopGuard)
  @Delete(':id/showcase/:showcaseId')
  async removeShowcase(
    @Param('id') id: string,
    @Param('showcaseId') showcaseId: string,
  ) {
    return await this.shopService.removeShowcaseProduct(id, showcaseId);
  }
}
