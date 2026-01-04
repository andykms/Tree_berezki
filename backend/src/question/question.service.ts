import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { GetQuestionQueryDto } from './dto/get-question.dto';
import { User } from '../user/entities/user.entity';
import { Question } from './entities/question.entity';
import { Product } from '../product/entities/product.entity';

@Injectable()
export class QuestionService {

  constructor(
    @InjectRepository(Question) private readonly questionRepository: Repository<Question>,
    @InjectRepository(Product) private readonly productRepository: Repository<Product>
  ) {}

  async create(createQuestionDto: CreateQuestionDto, user: User) {
    const account = user.accounts.find(account => account.id === createQuestionDto.accountId);
    
    const product = await this.productRepository.findOneOrFail({where: {id: createQuestionDto.productId}});

    const question = await this.questionRepository.create({
      ...createQuestionDto,
      product,
      account
    });

    return await this.questionRepository.save(question);
  }

  async findAll(getQuestionQueryDto: GetQuestionQueryDto) {
    const limit = Number(getQuestionQueryDto.limit);
    const page = Number(getQuestionQueryDto.page);

    const questions = await this.questionRepository.find({where: {product: {id: getQuestionQueryDto.productId}}, relations: {account: true}, take: limit, skip: limit * page, order: {created_at: 'DESC'}});

    return {
      items: questions,
      total: questions.length
    }
  }

  async findOne(id: string) {
    return await this.questionRepository.findOneOrFail({where: {id}, relations: {account: true}});
  }

  update(id: string, updateQuestionDto: UpdateQuestionDto) {
    return `This action updates a #${id} question`;
  }

  async remove(id: string, user: User) {
    const question = await this.questionRepository.findOneOrFail({where: {id, account: {user}}});
    await this.questionRepository.delete({id, account: {user}});
    return question;
  }
}
