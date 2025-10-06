import { Test, TestingModule } from '@nestjs/testing';
import { AucsionResaultsController } from './aucsion_resaults.controller';
import { AucsionResaultsService } from './aucsion_resaults.service';

describe('AucsionResaultsController', () => {
  let controller: AucsionResaultsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AucsionResaultsController],
      providers: [AucsionResaultsService],
    }).compile();

    controller = module.get<AucsionResaultsController>(AucsionResaultsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
