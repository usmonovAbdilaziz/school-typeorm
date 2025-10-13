import { CreateBitHistoryDto } from './dto/create-bit_history.dto';
import { UpdateBitHistoryDto } from './dto/update-bit_history.dto';
import { handleError, succesMessage } from '../helpers/response';
import { Injectable, NotFoundException } from '@nestjs/common';
import { AucsionService } from '../aucsion/aucsion.service';
import { BidHisory } from './entities/bit_history.entity';
import { BuyerService } from '../buyer/buyer.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class BitHistoryService {
  constructor(
    @InjectRepository(BidHisory)
    private readonly bitRepo: Repository<BidHisory>,
    private readonly aucsionService:AucsionService ,
    private readonly buyerService: BuyerService,
  ) {}
  async create(createBitHistoryDto: CreateBitHistoryDto) {
    try {
      const { aucsionId, buyerId } = createBitHistoryDto;
      const aucsion = await this.aucsionService.findOne(aucsionId);
      if (!aucsion) throw new NotFoundException('Aucsion not found');
      if (!(await this.buyerService.findOne(buyerId)))
        throw new NotFoundException('Buyer not found');
      const newBid = this.bitRepo.create(createBitHistoryDto)
      await this.bitRepo.save(newBid)
      return succesMessage(newBid,201)
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
      const bid = await this.bitRepo.findOne({where:{id}})
      if(!bid){
        throw new NotFoundException('Bit not found')
      }
      return succesMessage(bid)
    } catch (error) {
      handleError(error);
    }
  }

  async update(id: string, updateBitHistoryDto: UpdateBitHistoryDto) {
    try {
      await this.bitRepo.update(id,updateBitHistoryDto)
      const newBit = await this.findOne(id)
      return newBit
    } catch (error) {
      handleError(error);
    }
  }

  async remove(id: string) {
    try {
      await this.findOne(id)
      await this.bitRepo.delete({id})
      return succesMessage({message:'Bid delete succesfully'})
    } catch (error) {
      handleError(error);
    }
  }
}
