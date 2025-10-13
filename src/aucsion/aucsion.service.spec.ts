import { Test, TestingModule } from '@nestjs/testing';
import { AucsionService } from './aucsion.service';

describe('AucsionService', () => {
  let service: AucsionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AucsionService],
    }).compile();

    service = module.get<AucsionService>(AucsionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
