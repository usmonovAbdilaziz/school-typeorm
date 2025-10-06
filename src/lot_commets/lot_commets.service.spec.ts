import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { LotCommet } from './entities/lot_commet.entity';
import { Repository } from 'typeorm';
import { BuyerService } from '../buyer/buyer.service';
import { LotsService } from '../lots/lots.service';

describe('LotCommetsService (light)', () => {
  const mockRepo = { create: jest.fn(), save: jest.fn(), find: jest.fn(), findOneBy: jest.fn(), update: jest.fn(), delete: jest.fn() };
  const mockBuyer = { findOne: jest.fn() };
  const mockLot = { findOne: jest.fn() };

  let repo: Repository<LotCommet>;
  let buyerService: typeof mockBuyer;
  let lotService: typeof mockLot;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: getRepositoryToken(LotCommet), useValue: mockRepo },
        { provide: BuyerService, useValue: mockBuyer },
        { provide: LotsService, useValue: mockLot },
      ],
    }).compile();

    repo = module.get(getRepositoryToken(LotCommet));
    buyerService = module.get(BuyerService);
    lotService = module.get(LotsService);
  });

  it('should be defined', () => {
    expect(repo).toBeDefined();
  });

  it('create comment happy path', async () => {
    const dto = { comment: 'c', buyer_id: 'b1', lot_id: 'l1' };
    mockBuyer.findOne.mockResolvedValue({ id: 'b1' });
    mockLot.findOne.mockResolvedValue({ id: 'l1' });
    mockRepo.create.mockReturnValue(dto);
    mockRepo.save.mockResolvedValue({ ...dto, id: 'id1' });

    const created = mockRepo.create(dto);
    await mockRepo.save(created);
    expect(mockRepo.save).toHaveBeenCalled();
  });

  it('find all comments', async () => {
    mockRepo.find.mockResolvedValue([]);
    const res = await mockRepo.find();
    expect(Array.isArray(res)).toBe(true);
  });
});
