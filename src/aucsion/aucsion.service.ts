import { handleError, succesMessage } from '../helpers/response';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAucsionDto } from './dto/create-aucsion.dto';
import { UpdateAucsionDto } from './dto/update-aucsion.dto';
import { AdminsService } from '../admins/admins.service';
import { Aucsion } from './entities/aucsion.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { LotsService } from '../lots/lots.service';
import { Repository } from 'typeorm';

@Injectable()
export class AucsionService {
  constructor(
    @InjectRepository(Aucsion)
    private readonly aucsionRepo: Repository<Aucsion>,
    private readonly adminServise: AdminsService,
    private readonly lotsService: LotsService,
  ) {}
  async create(createAucsionDto: CreateAucsionDto) {
    try {
      const { adminId, lotId } = createAucsionDto;
      const admin = await this.adminServise.findOne(adminId);
      const lot = this.lotsService.findOne(lotId);
      if (!admin) throw new NotFoundException('Admin not found');
      if (!lot) throw new NotFoundException('Lot not found');
      await this.lotsService.update(lotId, { isPlaying: false });
      const newAucsion = this.aucsionRepo.create(createAucsionDto);
      await this.aucsionRepo.save(newAucsion);
      return succesMessage(newAucsion, 201);
    } catch (error) {
      handleError(error);
    }
  }

  async findAll() {
    try {
      const aucsions = await this.aucsionRepo.find({
        relations: ['admin', 'bids', 'lots'],
      });
      return succesMessage(aucsions);
    } catch (error) {
      handleError(error);
    }
  }

  async findOne(id: string) {
    try {
      const aucsion = await this.aucsionRepo.findOne({
        where: { id },
        relations: ['admin', 'bids', 'lots'],
      });
      if (!aucsion) {
        throw new NotFoundException('Aucsion not found');
      }
      return succesMessage(aucsion);
    } catch (error) {
      handleError(error);
    }
  }

  async update(id: string, updateAucsionDto: UpdateAucsionDto) {
    try {
      await this.aucsionRepo.update(id,updateAucsionDto)
      const aucsion = await this.findOne(id)
      return aucsion
    } catch (error) {
      handleError(error);
    }
  }

  async remove(id: string) {
    try {
      await this.findOne(id)
      await this.aucsionRepo.delete({id})
      return succesMessage({message:'Deleted aucsion succesfully'})
    } catch (error) {
      handleError(error);
    }
  }
}
