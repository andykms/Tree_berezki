import { Controller, Get, Query } from '@nestjs/common';
import { GetMeasuresQueryDto } from './dto/get-measures.dto';
import { MeasureService } from './measure.service';

@Controller('measure')
export class MeasureController {
  constructor(private readonly measureService: MeasureService) {}

  @Get('')
  async getMeasures(@Query() query: GetMeasuresQueryDto) {
    return await this.measureService.getMeasure(query);
  }
}
