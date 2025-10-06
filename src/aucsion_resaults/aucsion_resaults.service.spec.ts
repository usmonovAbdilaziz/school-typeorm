import { Test, TestingModule } from '@nestjs/testing';
import { AucsionResaultsService } from './aucsion_resaults.service';

describe('AucsionResaultsService', () => {
  let service: AucsionResaultsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AucsionResaultsService],
    }).compile();

    service = module.get<AucsionResaultsService>(AucsionResaultsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
