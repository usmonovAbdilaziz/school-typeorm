import { Test, TestingModule } from '@nestjs/testing';
import { LotCommetsController } from './lot_commets.controller';
import { LotCommetsService } from './lot_commets.service';

describe('LotCommetsController', () => {
  let controller: LotCommetsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LotCommetsController],
      providers: [LotCommetsService],
    }).compile();

    controller = module.get<LotCommetsController>(LotCommetsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
