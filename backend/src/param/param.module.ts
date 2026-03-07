import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParamService } from './param.service';
import { ParamController } from './param.controller';
import { Param } from './entities/param.entity';
import { MeasureModule } from '../measure/measure.module';

@Module({
  imports: [TypeOrmModule.forFeature([Param]), MeasureModule],
  controllers: [ParamController],
  providers: [ParamService],
  exports: [ParamService],
})
export class ParamModule {}
