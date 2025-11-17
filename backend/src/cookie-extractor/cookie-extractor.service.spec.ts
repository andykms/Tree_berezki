import { Test, TestingModule } from '@nestjs/testing';
import { CookieExtractorService } from './cookie-extractor.service';

describe('CookieExtractorService', () => {
  let service: CookieExtractorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CookieExtractorService],
    }).compile();

    service = module.get<CookieExtractorService>(CookieExtractorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
