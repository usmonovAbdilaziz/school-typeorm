import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { LotInterested } from './entities/lot_interested.entity';

describe('LotInterestedService (light)', () => {
  const mockRepo = { create: jest.fn(), save: jest.fn(), find: jest.fn() };

  beforeEach(async () => {
    await Test.createTestingModule({
      providers: [
        { provide: getRepositoryToken(LotInterested), useValue: mockRepo },
      ],
    }).compile();
  });

  it('create interest', async () => {
    const i = { id: 'i1' };
    mockRepo.create.mockReturnValue(i);
    mockRepo.save.mockResolvedValue(i);
    await mockRepo.save(mockRepo.create(i));
    expect(mockRepo.save).toHaveBeenCalled();
  });
});
