import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ShowcaseProductsService } from './showcase-products.service';
import { CreateShowcaseProductDto } from './dto/create-showcase-product.dto';
import { UpdateShowcaseProductDto } from './dto/update-showcase-product.dto';
import { UseGuards } from '@nestjs/common';
import { JwtShopGuard } from '../auth/guards/shop.guard';
import { JwtGuard } from '../auth/guards/jwt.guard';

@Controller('showcase-products')
export class ShowcaseProductsController {
  constructor(
    private readonly showcaseProductsService: ShowcaseProductsService,
  ) {}

  @UseGuards(JwtShopGuard)
  @UseGuards(JwtGuard)
  @Post(':id/showcase')
  async createShowcase(
    @Param('id') id: string,
    @Body() showcaseDto: CreateShowcaseProductDto,
  ) {
    return await this.showcaseProductsService.createShowcaseProduct(
      id,
      showcaseDto,
    );
  }

  @UseGuards(JwtShopGuard)
  @UseGuards(JwtGuard)
  @Delete(':id/showcase/:showcaseId')
  async removeShowcase(
    @Param('id') id: string,
    @Param('showcaseId') showcaseId: string,
  ) {
    return await this.showcaseProductsService.removeShowcaseProduct(
      id,
      showcaseId,
    );
  }

  @UseGuards(JwtGuard)
  @Get(':id/showcase')
  async getShowcase(@Param('id') id: string) {
    return await this.showcaseProductsService.getShowcaseProducts(id);
  }
}
