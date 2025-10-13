import { Test, TestingModule } from '@nestjs/testing';
import { BitHistoryController } from './bit_history.controller';
import { BitHistoryService } from './bit_history.service';

describe('BitHistoryController', () => {
  let controller: BitHistoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BitHistoryController],
      providers: [BitHistoryService],
    }).compile();

    controller = module.get<BitHistoryController>(BitHistoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
