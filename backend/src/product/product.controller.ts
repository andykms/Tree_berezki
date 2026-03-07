import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { JwtShopGuard } from '../auth/guards/shop.guard';
import { GetProductQueryDto } from './dto/get-products.dto';
import { GetProductsResponseDto } from './dto/get-products-response.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UseGuards(JwtShopGuard)
  @UseGuards(JwtGuard)
  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    return await this.productService.create(createProductDto);
  }

  @Get()
  async search(
    @Query() query: GetProductQueryDto,
  ): Promise<GetProductsResponseDto> {
    return await this.productService.search(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Product> {
    return await this.productService.findOne(id);
  }

  @UseGuards(JwtShopGuard)
  @UseGuards(JwtGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return await this.productService.update(id, updateProductDto);
  }

  @UseGuards(JwtShopGuard)
  @UseGuards(JwtGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.productService.remove(id);
  }
}
