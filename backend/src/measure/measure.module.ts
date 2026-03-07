import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Measure } from './entities/measure.entity';
import { MeasureService } from './measure.service';
import { MeasureController } from './measure.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Measure])],
  controllers: [MeasureController],
  providers: [MeasureService],
  exports: [MeasureService],
})
export class MeasureModule {}
