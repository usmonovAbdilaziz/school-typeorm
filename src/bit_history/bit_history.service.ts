import { CreateBitHistoryDto } from './dto/create-bit_history.dto';
import { UpdateBitHistoryDto } from './dto/update-bit_history.dto';
import { handleError, succesMessage } from '../helpers/response';
import { Injectable, NotFoundException } from '@nestjs/common';
import { BidHisory } from './entities/bit_history.entity';
import { BuyerService } from '../buyer/buyer.service';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { LotsService } from 'src/lots/lots.service';

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
      const {
        lotId,
        lotAction: { buyerId: string, amount: number },
      } = createBitHistoryDto;
      if (!(await this.lotService.findOne(lotId)))
        throw new NotFoundException('Lot  not found');
      const newBid = this.bitRepo.create(createBitHistoryDto);
      await this.bitRepo.save(newBid);
      return succesMessage(newBid, 201);
    } catch (error) {
      handleError(error);
    }
  }

  async findAll() {
    try {
      const bids = await this.bitRepo.find({ relations: ['aucsion', 'buyer'] });
      return succesMessage(bids);
    } catch (error) {
      handleError(error);
    }
  }

  async findOne(id: string) {
    try {
      const bid = await this.bitRepo.findOne({ where: { id } });
      if (!bid) {
        throw new NotFoundException('Bit not found');
      }
      return succesMessage(bid);
    } catch (error) {
      handleError(error);
    }
  }

  async update(id: string, updateBitHistoryDto: UpdateBitHistoryDto) {
    try {
      const bit = await this.bitRepo.findOne({ where: { id } });
      if (!bit) throw new NotFoundException('Bit topilmadi');

      // Eski lotAction massiv yoki string bo‘lishi mumkin
      let actions:any = [];

      // Agar JSON string bo‘lsa — parse qilamiz
      if (typeof bit.lotAction === 'string') {
        actions = JSON.parse(bit.lotAction);
      } else if (Array.isArray(bit.lotAction)) {
        actions = bit.lotAction;
      }

      // Yangi action obyekt
      const newAction = {
        buyerId: updateBitHistoryDto.lotAction!.buyerId,
        amount: updateBitHistoryDto.lotAction!.amount,
        actionTime: new Date(),
      };

      // Massivga qo‘shamiz
      actions.push(newAction);

      // Qaytadan stringga o‘tkazamiz (agar type json bo‘lsa ham ishlaydi)
      bit.lotAction = actions;

      await this.bitRepo.save(bit);
      return bit;
    } catch (error) {
      handleError(error);
    }
  }

  async remove(id: string) {
    try {
      await this.findOne(id);
      await this.bitRepo.delete({ id });
      return succesMessage({ message: 'Bid delete succesfully' });
    } catch (error) {
      handleError(error);
    }
  }
}
