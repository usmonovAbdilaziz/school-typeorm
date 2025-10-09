import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateLotDto } from './dto/create-lot.dto';
import { UpdateLotDto } from './dto/update-lot.dto';
import { handleError, succesMessage } from '../helpers/response';
import { InjectRepository } from '@nestjs/typeorm';
import { Lot } from './entities/lot.entity';
import { Repository } from 'typeorm';
import { SellerService } from '../seller/seller.service';

@Injectable()
export class LotsService {
  constructor(
    @InjectRepository(Lot) private readonly lotsRepo: Repository<Lot>,
    private readonly sellerService: SellerService,
  ) {}
  async create(createLotDto: CreateLotDto) {
    try {
      const { seller_id, seller_status } = createLotDto;

      const seller = await this.sellerService.findOne(seller_id);
      if (!seller) {
        throw new NotFoundException('Seller not found');
      }

      const existingLot = await this.lotsRepo.findOne({ where: { seller_id } });
      if (existingLot) {
        throw new ConflictException('Lots already exists');
      }

      const { description } = seller.data as any;

      const newLot = this.lotsRepo.create({ ...createLotDto, description });

      await this.sellerService.update(seller_id, { status: seller_status });

      await this.lotsRepo.save(newLot);

      return succesMessage(newLot, 201);
    } catch (error) {
      handleError(error);
    }
  }

  async findAll() {
    try {
      const lots = await this.lotsRepo.find({
        relations: ['interests', 'comments', 'seller', 'results'],
      });
      return succesMessage(lots);
    } catch (error) {
      handleError(error);
    }
  }

  async findOne(id: string) {
    try {
      const lot = await this.lotsRepo.findOne({
        where: { id },
        relations: ['interests', 'comments', 'seller', 'results'],
      });
      if (!lot) {
        throw new NotFoundException('Lot not found');
      }
      return succesMessage(lot);
    } catch (error) {
      handleError(error);
    }
  }

  async update(id: string, updateLotDto: UpdateLotDto) {
    try {
      await this.lotsRepo.update(id, updateLotDto);
      const lot = await this.findOne(id);
      return lot;
    } catch (error) {
      handleError(error);
    }
  }

  async remove(id: string) {
    try {
      await this.findOne(id);
      await this.lotsRepo.delete(id);
      return succesMessage({ message: 'Delete lot from ID' });
    } catch (error) {
      handleError(error);
    }
  }
}
