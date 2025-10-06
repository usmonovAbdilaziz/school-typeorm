import { Test, TestingModule } from '@nestjs/testing';
import { LotInterestedController } from './lot_interested.controller';
import { LotInterestedService } from './lot_interested.service';

describe('LotInterestedController', () => {
  let controller: LotInterestedController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LotInterestedController],
      providers: [LotInterestedService],
    }).compile();

    controller = module.get<LotInterestedController>(LotInterestedController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
