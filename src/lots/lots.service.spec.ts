import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Lot } from './entities/lot.entity';

describe('LotsService (light)', () => {
  const mockRepo = { create: jest.fn(), save: jest.fn(), find: jest.fn() };

  beforeEach(async () => {
    await Test.createTestingModule({
      providers: [{ provide: getRepositoryToken(Lot), useValue: mockRepo }],
    }).compile();
  });

  it('create lot', async () => {
    const l = { id: 'l1' };
    mockRepo.create.mockReturnValue(l);
    mockRepo.save.mockResolvedValue(l);
    await mockRepo.save(mockRepo.create(l));
    expect(mockRepo.save).toHaveBeenCalled();
  });
});