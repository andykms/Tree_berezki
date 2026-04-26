import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  create(createCategoryDto: CreateCategoryDto) {
    return 'This action adds a new category';
  }

  async findAll() {
    const categories = await this.categoryRepository.find();
    return {
      items: categories,
      total: categories.length,
    };
  }

  async findOne(id: string) {
    return await this.categoryRepository.findOneOrFail({ where: { id } });
  }

  async findRequiredParams(id: string) {
    const category = await this.categoryRepository.findOneOrFail({
      where: { id },
      relations: ['params'],
    });
    return {
      items: category.params,
      total: category.params.length,
    };
  }

  update(id: string, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: string) {
    return `This action removes a #${id} category`;
  }
}
