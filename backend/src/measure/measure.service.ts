import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Measure } from './entities/measure.entity';
import { GetMeasuresQueryDto } from './dto/get-measures.dto';

@Injectable()
export class MeasureService {
  constructor(
    @InjectRepository(Measure)
    private measureRepository: Repository<Measure>,
  ) {}

  async findOne(id: number) {
    return await this.measureRepository.findOneOrFail({ where: { id } });
  }

  async getMeasure(query: GetMeasuresQueryDto) {
    const limit = Number(query.limit) || 10;
    const page = Number(query.page) || 1;

    const measures = await this.measureRepository.find({
      take: limit,
      skip: page * limit,
    });

    return { items: measures, total: measures.length };
  }
}
