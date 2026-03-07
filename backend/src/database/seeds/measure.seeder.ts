import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Measure } from '../../measure/entities/measure.entity';
import './data/measures.json';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class MeasureSeeder {
  constructor(
    @InjectRepository(Measure)
    private readonly measureRepository: Repository<Measure>,
  ) {}

  async seed() {
    try {
      // Проверяем, есть ли уже данные в таблице
      const count = await this.measureRepository.count();

      if (count > 0) {
        console.log('Меры измерений уже засеяны, пропускаем...');
        return;
      }

      // Читаем JSON файл
      const filePath = path.join(__dirname, 'data', 'measures.json');
      console.log('DIR', __dirname);
      console.log('PATH', filePath);
      const measuresData = JSON.parse(
        fs.readFileSync(filePath, 'utf8'),
      ) as string[];

      // Создаем сущности
      const measures = measuresData.map((value) => {
        const measure = new Measure();
        measure.value = value;
        return measure;
      });

      // Сохраняем пакетами по 50 записей для оптимизации
      const batchSize = 50;
      for (let i = 0; i < measures.length; i += batchSize) {
        const batch = measures.slice(i, i + batchSize);
        await this.measureRepository.save(batch);
        console.log(
          `Засеяно ${Math.min(i + batchSize, measures.length)} из ${measures.length} мер измерений`,
        );
      }

      console.log('Сидинг мер измерений завершен успешно!');
    } catch (error) {
      console.error('Ошибка при сидинге мер измерений:', error);
      throw error;
    }
  }
}
