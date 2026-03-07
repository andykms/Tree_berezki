import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  Param,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { JwtShopGuard } from '../auth/guards/shop.guard';
import { ParamService } from './param.service';
import { CreateParamDto } from './dto/create-param.dto';
import { GetParamsQueryDto } from './dto/get-params.dto';
import { GetRequiredParamsQueryDto } from './dto/get-required-params.dto';

@Controller('param')
export class ParamController {
  constructor(private readonly paramService: ParamService) {}

  @UseGuards(JwtGuard)
  @UseGuards(JwtShopGuard)
  @Post()
  async createParam(@Body() data: CreateParamDto) {
    return await this.paramService.createParam(data);
  }

  @Get()
  async getParams(@Query() query: GetParamsQueryDto) {
    return await this.paramService.getParams(query);
  }

  @Get(':id')
  async getParam(@Param('id') id: string) {
    return await this.paramService.findOne(id);
  }

  @Get('required-params')
  async findRequiredParam(@Query() query: GetRequiredParamsQueryDto) {
    return await this.paramService.getParamsByCategory(query.categoryId);
  }
}
