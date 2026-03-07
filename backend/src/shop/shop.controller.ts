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
import { JwtShopGuard } from '../auth/guards/shop.guard';
import { Shop } from './entities/shop.entity';
import { GetShopsResponseDto } from './dto/get-shops-reponse.dto';

@Controller('shop')
export class ShopController {
  constructor(private readonly shopService: ShopService) {}

  @UseGuards(JwtGuard)
  @Post()
  async create(
    @Body() createShopDto: CreateShopDto,
    @Req() req,
  ): Promise<GetShopsResponseDto> {
    return await this.shopService.create(createShopDto, req.user);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Shop> {
    return await this.shopService.findOne(id);
  }

  @UseGuards(JwtShopGuard)
  @UseGuards(JwtGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateShopDto: UpdateShopDto,
  ): Promise<GetShopsResponseDto> {
    return await this.shopService.update(id, updateShopDto);
  }

  @UseGuards(JwtShopGuard)
  @UseGuards(JwtGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.shopService.remove(id);
  }
}
