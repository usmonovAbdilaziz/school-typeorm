import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateLotInterestedDto } from './dto/create-lot_interested.dto';
import { UpdateLotInterestedDto } from './dto/update-lot_interested.dto';
import { handleError, succesMessage } from 'src/helpers/response';
import { InjectRepository } from '@nestjs/typeorm';
import { LotInterested } from './entities/lot_interested.entity';
import { Repository } from 'typeorm';
import { LotsService } from 'src/lots/lots.service';
import { BuyerService } from 'src/buyer/buyer.service';

@Injectable()
export class LotInterestedService {
  constructor(
    @InjectRepository(LotInterested)
    private readonly interesRepo: Repository<LotInterested>,
    private readonly buyerService: BuyerService,
    private readonly lotService: LotsService,
  ) {}
  async create(createLotInterestedDto: CreateLotInterestedDto) {
    try {
      const { lot_id, buyer_id } = createLotInterestedDto;
      const lot = await this.lotService.findOne(lot_id);
      if (!lot) {
        throw new NotFoundException('Lot not found');
      }
      const buyer = await this.buyerService.findOne(buyer_id);
      if (!buyer) {
        throw new NotFoundException('Buyer not found');
      }
      if(await this.interesRepo.findOne({where:{lot_id,buyer_id}})) throw new ConflictException('Onse allow liked')
      const interes = this.interesRepo.create(createLotInterestedDto);
      await this.interesRepo.save(interes);
      return succesMessage(interes, 201);
    } catch (error) {
      handleError(error);
    }
  }

  async findAll() {
    try {
      const inters = await this.interesRepo.find({
        relations: ['lot', 'buyer'],
      });
      return succesMessage(inters)
    } catch (error) {
      handleError(error);
    }
  }

  async findOne(id: string) {
    try {
      const interes = await this.interesRepo.findOne({
        where: { id },
        relations: ['lot', 'buyer'],
      });
      if(!interes){
        throw new NotFoundException('Lot-interested not found')
      }
      return succesMessage(interes)
    } catch (error) {
      handleError(error);
    }
  }

  async update(id: string, updateLotInterestedDto: UpdateLotInterestedDto) {
    try {
      await this.interesRepo.update(id,updateLotInterestedDto)
      const lotInterst=await this.findOne(id)
      return lotInterst
    } catch (error) {
      handleError(error);
    }
  }

  async remove(id: string) {
    try {
      await this.findOne(id)
      await this.interesRepo.delete(id)
      return succesMessage({message:'Delete from ID'})
    } catch (error) {
      handleError(error);
    }
  }
}
