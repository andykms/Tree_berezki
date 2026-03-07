import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import { Param } from '../product/entities/param.entity';

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
    return await this.categoryRepository.find();
  }

  async findOne(id: string) {
    return await this.categoryRepository.findOne({ where: { id } });
  }

  update(id: string, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: string) {
    return `This action removes a #${id} category`;
  }

  async getRequiredParams(id: string) {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['requiredParams'],
    });
    if (!category) {
      throw new NotFoundException('категория не найдена');
    }
    const requiredParams = category.params;
    const result: (Omit<Param, 'measure'> & { measure: string })[] = [];
    for (const param of requiredParams) {
      result.push({
        ...param,
        measure: param.measure.value,
      });
    }
    return result;
  }
}
