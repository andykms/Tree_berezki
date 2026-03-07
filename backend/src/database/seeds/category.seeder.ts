import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../../category/entities/category.entity';
import './data/categories.json';
import * as fs from 'fs';
import * as path from 'path';

interface CategoryData {
  name: string;
  subcategories: string[];
  subsubcategories: Record<string, string[]>;
}

@Injectable()
export class CategorySeeder {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async seed() {
    try {
      // Проверяем, есть ли уже данные в таблице
      const count = await this.categoryRepository.count();

      if (count > 0) {
        console.log('Категории уже засеяны, пропускаем...');
        return;
      }

      // Читаем JSON файл
      const filePath = path.join(__dirname, 'data', 'categories.json');
      const categoriesData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

      const categoriesToSave: Category[] = [];

      // Обрабатываем каждую корневую категорию
      for (const categoryData of categoriesData.categories) {
        // Добавляем корневую категорию
        const rootCategory = new Category();
        rootCategory.path = categoryData.name;
        categoriesToSave.push(rootCategory);

        // Добавляем подкатегории первого уровня
        for (const subcategoryName of categoryData.subcategories) {
          const subcategory = new Category();
          subcategory.path = `${categoryData.name}/${subcategoryName}`;
          categoriesToSave.push(subcategory);

          // Добавляем подкатегории второго уровня, если они есть
          if (
            categoryData.subsubcategories &&
            categoryData.subsubcategories[subcategoryName]
          ) {
            for (const subsubcategoryName of categoryData.subsubcategories[
              subcategoryName
            ]) {
              const subsubcategory = new Category();
              subsubcategory.path = `${categoryData.name}/${subcategoryName}/${subsubcategoryName}`;
              categoriesToSave.push(subsubcategory);
            }
          }
        }
      }

      // Сохраняем все категории
      console.log(`Всего категорий для сохранения: ${categoriesToSave.length}`);

      // Сохраняем пакетами для оптимизации
      const batchSize = 50;
      for (let i = 0; i < categoriesToSave.length; i += batchSize) {
        const batch = categoriesToSave.slice(i, i + batchSize);
        await this.categoryRepository.save(batch);
        console.log(
          `Засеяно ${Math.min(i + batchSize, categoriesToSave.length)} из ${categoriesToSave.length} категорий`,
        );
      }

      console.log('Сидинг категорий завершен успешно!');
      console.log(`Всего создано категорий: ${categoriesToSave.length}`);
    } catch (error) {
      console.error('Ошибка при сидинге категорий:', error);
      throw error;
    }
  }
}
