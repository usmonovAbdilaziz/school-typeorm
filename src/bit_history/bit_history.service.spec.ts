import { Test, TestingModule } from '@nestjs/testing';
import { BitHistoryService } from './bit_history.service';

describe('BitHistoryService', () => {
  let service: BitHistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BitHistoryService],
    }).compile();

    service = module.get<BitHistoryService>(BitHistoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
