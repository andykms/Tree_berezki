import { Test, TestingModule } from '@nestjs/testing';
import { ShowcaseProductsController } from './showcase-products.controller';
import { ShowcaseProductsService } from './showcase-products.service';

describe('ShowcaseProductsController', () => {
  let controller: ShowcaseProductsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShowcaseProductsController],
      providers: [ShowcaseProductsService],
    }).compile();

    controller = module.get<ShowcaseProductsController>(
      ShowcaseProductsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
