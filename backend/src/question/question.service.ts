import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { GetQuestionQueryDto } from './dto/get-question.dto';
import { User } from '../user/entities/user.entity';
import { Question } from './entities/question.entity';
import { ProductService } from '../product/product.service';

@Injectable()
export class QuestionService {

  @Inject(ProductService)
  private readonly productService: ProductService;


  constructor(
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>
  ) {}

  async create(createQuestionDto: CreateQuestionDto, user: User) {
    const account = user.accounts.find(
      (account) => account.id === createQuestionDto.accountId,
    );

    const product = await this.productService.findOne(createQuestionDto.productId);

    const question = await this.questionRepository.create({
      ...createQuestionDto,
      product,
      account,
    });

    return await this.questionRepository.save(question);
  }

  async findAll(getQuestionQueryDto: GetQuestionQueryDto) {
    const limit = Number(getQuestionQueryDto.limit);
    const page = Number(getQuestionQueryDto.page);

    const questions = await this.questionRepository.find({
      where: { product: { id: getQuestionQueryDto.productId } },
      relations: { account: true },
      take: limit,
      skip: limit * page,
      order: { created_at: 'DESC' },
    });

    return {
      items: questions,
      total: questions.length,
    };
  }

  async findOne(id: string) {
    return await this.questionRepository.findOneOrFail({
      where: { id },
      relations: { account: true },
    });
  }

  update(id: string, updateQuestionDto: UpdateQuestionDto) {
    return `This action updates a #${id} question`;
  }

  async remove(id: string, user: User) {
    const question = await this.questionRepository.findOneOrFail({
      where: { id, account: { user } },
    });
    await this.questionRepository.delete({ id, account: { user } });
    return question;
  }
}
