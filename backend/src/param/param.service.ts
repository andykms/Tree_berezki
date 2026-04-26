import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Param } from './entities/param.entity';
import { GetParamsQueryDto } from './dto/get-params.dto';
import { CreateParamDto } from './dto/create-param.dto';
import { MeasureService } from '../measure/measure.service';

@Injectable()
export class ParamService {
  @Inject(MeasureService)
  private measureService: MeasureService;

  constructor(
    @InjectRepository(Param)
    private paramRepository: Repository<Param>,
  ) {}

  async createParam(data: CreateParamDto) {
    const measure = await this.measureService.findOne(data.measureId);
    const param = await this.paramRepository.create({ ...data, measure });
    await this.paramRepository.save(param);
    return param;
  }

  async getParams(query: GetParamsQueryDto) {
    const limit = Number(query.limit) || 10;
    const page = Number(query.page) || 1;

    const params = await this.paramRepository.find({
      take: limit,
      skip: page * limit,
    });

    return { items: params, total: params.length };
  }

  async findOne(id: string) {
    return await this.paramRepository.findOneOrFail({
      where: { id },
    });
  }
}
