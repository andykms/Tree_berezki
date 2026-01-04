import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Req } from '@nestjs/common';
import { QuestionService } from './question.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { GetQuestionQueryDto } from './dto/get-question.dto';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { AccountGuard } from '../auth/guards/account.guard';

@Controller('question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @UseGuards(JwtGuard, AccountGuard)
  @Post()
  async create(@Body() createQuestionDto: CreateQuestionDto, @Req() req) {
    return await this.questionService.create(createQuestionDto, req.user);
  }

  @Get()
  async findAll(@Query() getQuestionQueryDto: GetQuestionQueryDto) {
    return await this.questionService.findAll(getQuestionQueryDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.questionService.findOne(id);
  }

  @UseGuards(JwtGuard, AccountGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req) {
    return await this.questionService.remove(id, req.user);
  }
}
