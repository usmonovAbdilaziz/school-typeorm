import { CreateAucsionResaultDto } from './dto/create-aucsion_resault.dto';
import { UpdateAucsionResaultDto } from './dto/update-aucsion_resault.dto';
import { handleError, succesMessage } from '../helpers/response';
import { AucsionResault } from './entities/aucsion_resault.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { BuyerService } from '../buyer/buyer.service';
import { LotsService } from '../lots/lots.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AucsionResaultsService {
  constructor(
    @InjectRepository(AucsionResault)
    private readonly resultRepo: Repository<AucsionResault>,
    private readonly buyerService: BuyerService,
    private readonly lotsService: LotsService,
  ) {}
  async create(createAucsionResaultDto: CreateAucsionResaultDto) {
    try {
      const { lot_id, buyer_id } = createAucsionResaultDto;

      if (!(await this.lotsService.findOne(lot_id)))
        throw new NotFoundException('Lot not found');
      if (!(await this.buyerService.findOne(buyer_id)))
        throw new NotFoundException('Buyer not found');
      const newWinner = this.resultRepo.create(createAucsionResaultDto);
      await this.resultRepo.save(newWinner);
      return succesMessage(newWinner, 201);
    } catch (error) {
      handleError(error);
    }
  }

  async findAll() {
    try {
      const results = await this.resultRepo.find({
        relations: ['buyer', 'lot'],
        order: { created_at: 'DESC' } as any,
      });
      return succesMessage(results);
    } catch (error) {
      handleError(error);
    }
  }

  async findOne(id: string) {
    try {
      const result = await this.resultRepo.findOne({
        where: { id },
        relations: ['buyer', 'lot'],
      });
      if (!result) throw new NotFoundException(`Result not found`);
      return succesMessage(result);
    } catch (error) {
      handleError(error);
    }
  }

  async update(id: string, updateAucsionResaultDto: UpdateAucsionResaultDto) {
    try {
      const existing = await this.resultRepo.findOneBy({ id });
      if (!existing) throw new NotFoundException('Result not found');

      if (updateAucsionResaultDto.lot_id) {
        const lot = await this.lotsService.findOne(
          updateAucsionResaultDto.lot_id,
        );
        if (!lot) throw new NotFoundException('Lot not found');
      }

      if (updateAucsionResaultDto.buyer_id) {
        const buyer = await this.buyerService.findOne(
          updateAucsionResaultDto.buyer_id,
        );
        if (!buyer) throw new NotFoundException('Buyer not found');
      }

      await this.resultRepo.update(id, updateAucsionResaultDto);
      const updated = await this.findOne(id);
      return updated;
    } catch (error) {
      handleError(error);
    }
  }

  async remove(id: string) {
    try {
      const existing = await this.resultRepo.findOneBy({ id });
      if (!existing) throw new NotFoundException('Result not found');
      await this.resultRepo.delete(id);
      return succesMessage({ message: 'Deleted successfully' });
    } catch (error) {
      handleError(error);
    }
  }
}
