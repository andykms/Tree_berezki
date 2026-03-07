import { Test, TestingModule } from '@nestjs/testing';
import { ParamController } from './param.controller';
import { ParamService } from './param.service';

describe('ParamController', () => {
  let controller: ParamController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ParamController],
      providers: [ParamService],
    }).compile();

    controller = module.get<ParamController>(ParamController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
