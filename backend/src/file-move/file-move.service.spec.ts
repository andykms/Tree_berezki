import { Test, TestingModule } from '@nestjs/testing';
import { FileMoveService } from './file-move.service';

describe('FileMoveService', () => {
  let service: FileMoveService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FileMoveService],
    }).compile();

    service = module.get<FileMoveService>(FileMoveService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
