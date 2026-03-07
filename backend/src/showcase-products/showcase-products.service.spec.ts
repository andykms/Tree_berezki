import { Test, TestingModule } from '@nestjs/testing';
import { ShowcaseProductsService } from './showcase-products.service';

describe('ShowcaseProductsService', () => {
  let service: ShowcaseProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ShowcaseProductsService],
    }).compile();

    service = module.get<ShowcaseProductsService>(ShowcaseProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
