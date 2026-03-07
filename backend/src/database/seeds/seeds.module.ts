import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Measure } from '../../measure/entities/measure.entity';
import { Category } from '../../category/entities/category.entity';
import { MeasureSeeder } from './measure.seeder';
import { CategorySeeder } from './category.seeder';

@Module({
  imports: [TypeOrmModule.forFeature([Measure, Category])],
  providers: [MeasureSeeder, CategorySeeder],
  exports: [MeasureSeeder, CategorySeeder],
})
export class SeedsModule {}
