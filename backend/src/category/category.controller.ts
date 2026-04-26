import {
  Controller,
  Get,
  Param,
} from '@nestjs/common';
import { CategoryService } from './category.service';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  async findAll() {
    return await this.categoryService.findAll();
  }

  @Get(":id/required-params") 
  async findRequiredParams(@Param('id') id: string) {
    return await this.categoryService.findRequiredParams(id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.categoryService.findOne(id);
  }
}
