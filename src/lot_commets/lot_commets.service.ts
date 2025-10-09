import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateLotCommetDto } from './dto/create-lot_commet.dto';
import { UpdateLotCommetDto } from './dto/update-lot_commet.dto';
import { LotCommet } from './entities/lot_commet.entity';
import { BuyerService } from '../buyer/buyer.service';
import { LotsService } from '../lots/lots.service';
import { handleError, succesMessage } from '../helpers/response';

@Injectable()
export class LotCommetsService {
  constructor(
    @InjectRepository(LotCommet)
    private readonly lotCommetRepository: Repository<LotCommet>,
    private readonly buyerService: BuyerService,
    private readonly lotService: LotsService,
  ) {}

  async create(createLotCommetDto: CreateLotCommetDto) {
    try {
      const { lot_id, buyer_id } = createLotCommetDto;
      const lot = await this.lotService.findOne(lot_id);
      const buyer = await this.buyerService.findOne(buyer_id);
      if (!lot) throw new NotFoundException('Lot not found');
      if (!buyer) throw new NotFoundException('Buyer not found');
      const { full_name } = buyer.data as any;
      const newLotCommet = this.lotCommetRepository.create({
        ...createLotCommetDto,
        buyer_name: full_name,
      });
      await this.lotCommetRepository.save(newLotCommet);
      return succesMessage(newLotCommet);
    } catch (error) {
      handleError(error);
    }
  }

  async findAll() {
    try {
      const result = await this.lotCommetRepository.find({
        relations: ['lot', 'buyer'],
      });
      return succesMessage(result);
    } catch (error) {
      handleError(error);
    }
  }

  async findOne(id: string) {
    try {
      const lotCommet = await this.lotCommetRepository.findOne({
        where: { id },
        relations: ['lot', 'buyer'],
      });
      if (!lotCommet) {
        throw new NotFoundException(`Lot comment with ID ${id} not found`);
      }
      return lotCommet;
    } catch (error) {
      handleError(error);
    }
  }

  async update(id: string, updateLotCommetDto: UpdateLotCommetDto) {
    try {
      await this.lotCommetRepository.update(id, updateLotCommetDto);
      const lotCommet = await this.findOne(id);
      if (!lotCommet) throw new NotFoundException('Commet not found');
      return succesMessage(lotCommet);
    } catch (error) {
      handleError(error);
    }
  }

  async remove(id: string) {
    try {
      await this.findOne(id);
      await this.lotCommetRepository.delete(id);
      return succesMessage({ message: 'Deleted succesfully' });
    } catch (error) {
      handleError(error);
    }
  }
}
