import { Test, TestingModule } from '@nestjs/testing';
import { ParamService } from './param.service';

describe('ParamService', () => {
  let service: ParamService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ParamService],
    }).compile();

    service = module.get<ParamService>(ParamService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
