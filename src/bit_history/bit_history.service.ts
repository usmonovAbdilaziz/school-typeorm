import { CreateBitHistoryDto } from './dto/create-bit_history.dto';
import { UpdateBitHistoryDto } from './dto/update-bit_history.dto';
import { handleError, succesMessage } from '../helpers/response';
import { Injectable, NotFoundException } from '@nestjs/common';
import { BidHisory } from './entities/bit_history.entity';
import { BuyerService } from '../buyer/buyer.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LotsService } from '../lots/lots.service';

@Injectable()
export class BitHistoryService {
  constructor(
    @InjectRepository(BidHisory)
    private readonly bitRepo: Repository<BidHisory>,
    private readonly buyerService: BuyerService,
    private readonly lotService: LotsService,
  ) {}

  async create(createBitHistoryDto: CreateBitHistoryDto) {
    try {
      const { lotId } = createBitHistoryDto;

      if (!(await this.lotService.findOne(lotId)))
        throw new NotFoundException('Lot not found');

      // Create lotAction with timestamp
      const lotAction = {
        buyerId: createBitHistoryDto.lotAction.buyerId,
        amount: createBitHistoryDto.lotAction.amount,
        actionTime: new Date(),
      };

      const newBid = this.bitRepo.create({
        lotId,
        lotAction: [lotAction], // Changed from lotAction to lotAction: [lotAction]
      });

      await this.bitRepo.save(newBid);
      return succesMessage(newBid, 201);
    } catch (error) {
      handleError(error);
    }
  }

  async findAll() {
    try {
      const bids = await this.bitRepo.find();
      return succesMessage(bids);
    } catch (error) {
      handleError(error);
    }
  }

  async findOne(id: string) {
    try {
      const bid = await this.bitRepo.findOne({ where: { id } });
      if (!bid) {
        throw new NotFoundException('Bid not found');
      }
      return succesMessage(bid);
    } catch (error) {
      handleError(error);
    }
  }

  async update(dto: UpdateBitHistoryDto) {
    const bit = await this.bitRepo.findOne({ where: { lotId: dto.lotId } });
    const buyer = await this.buyerService.findOne(dto.lotAction!.buyerId);
    if (!buyer) {
      throw new NotFoundException('Buyer not found');
    }
    if (!bit) {
      // lot uchun birinchi bid
      const newBit = this.bitRepo.create({
        lotId: dto.lotId,
        lotAction: [
          {
            buyerId: dto.lotAction!.buyerId,
            amount: dto.lotAction!.amount,
            actionTime: new Date(),
          },
        ],
      });
      return this.bitRepo.save(newBit);
    }

    // lot uchun eski arrayga yangi action qo‘shamiz
    bit.lotAction.push({
      buyerId: dto.lotAction!.buyerId,
      amount: dto.lotAction!.amount,
      actionTime: new Date(),
    });

    return this.bitRepo.save(bit);
  }

  async remove(id: string) {
    try {
      await this.findOne(id);
      await this.bitRepo.delete({ id });
      return succesMessage({ message: 'Bid deleted successfully' });
    } catch (error) {
      handleError(error);
    }
  }

  async getBidsForLot(lotId: string) {
    try {
      const bidHistory = await this.bitRepo.findOne({ where: { lotId } });
      if (!bidHistory) {
        return [];
      }

      // Sort bids by amount in ascending order (so highest is last)
      return bidHistory.lotAction.sort((a, b) => a.amount - b.amount);
    } catch (error) {
      handleError(error);
      return [];
    }
  }
}
