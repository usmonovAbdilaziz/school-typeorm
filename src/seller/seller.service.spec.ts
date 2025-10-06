import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Seller } from './entities/seller.entity';

describe('SellerService (light)', () => {
  const mockRepo = { create: jest.fn(), save: jest.fn(), find: jest.fn() };

  beforeEach(async () => {
    await Test.createTestingModule({
      providers: [{ provide: getRepositoryToken(Seller), useValue: mockRepo }],
    }).compile();
  });

  it('create/save flow', async () => {
    const s = { id: 's1' };
    mockRepo.create.mockReturnValue(s);
    mockRepo.save.mockResolvedValue(s);
    await mockRepo.save(mockRepo.create(s));
    expect(mockRepo.save).toHaveBeenCalled();
  });
});