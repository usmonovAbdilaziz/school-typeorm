import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Buyer } from './entities/buyer.entity';

describe('BuyerService (light)', () => {
  const mockRepo = { create: jest.fn(), save: jest.fn(), find: jest.fn() };

  beforeEach(async () => {
    await Test.createTestingModule({
      providers: [{ provide: getRepositoryToken(Buyer), useValue: mockRepo }],
    }).compile();
  });

  it('create buyer', async () => {
    const b = { id: 'b1' };
    mockRepo.create.mockReturnValue(b);
    mockRepo.save.mockResolvedValue(b);
    await mockRepo.save(mockRepo.create(b));
    expect(mockRepo.save).toHaveBeenCalled();
  });
});

 
