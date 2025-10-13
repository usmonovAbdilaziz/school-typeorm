import { Test, TestingModule } from '@nestjs/testing';
import { AucsionController } from './aucsion.controller';
import { AucsionService } from './aucsion.service';

describe('AucsionController', () => {
  let controller: AucsionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AucsionController],
      providers: [AucsionService],
    }).compile();

    controller = module.get<AucsionController>(AucsionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
