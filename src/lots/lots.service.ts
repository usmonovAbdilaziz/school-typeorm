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
import { AdminsService } from '../admins/admins.service';
import { FileService } from '../file/file.service';

@Injectable()
export class LotsService {
  constructor(
    @InjectRepository(Lot) private readonly lotsRepo: Repository<Lot>,
    private readonly adminService: AdminsService,
    private readonly fileService: FileService,
  ) {}

  async create(createLotDto: CreateLotDto, files?: Express.Multer.File[]) {
    try {
      const { admin_id, tool_name, tool_type } = createLotDto;

      // Check if admin exists
      const admin = await this.adminService.findOne(admin_id);
      if (!admin) throw new NotFoundException('Admin not found');

      // Check if lot with same tool already exists
      const existingLot = await this.lotsRepo.findOne({
        where: { tool_name, tool_type },
      });
      if (existingLot) {
        throw new ConflictException('Lot with this tool already exists');
      }

      // Handle file uploads if provided
      let imageUrl: string[] | undefined = undefined;
      if (files && files.length > 0) {
        imageUrl = await this.fileService.createFiles(files);
      }

      // Create new lot with seller information
      const newLot = this.lotsRepo.create({
        ...createLotDto,
        image_url: imageUrl,
      });

      await this.lotsRepo.save(newLot);

      return succesMessage(newLot, 201);
    } catch (error) {
      handleError(error);
    }
  }

  async findAll() {
    try {
      const lots = await this.lotsRepo.find({
        relations: ['interests', 'comments', 'results', 'aucsion'],
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
        relations: ['interests', 'comments', 'results', 'aucsion'],
      });
      if (!lot) {
        throw new NotFoundException('Lot not found');
      }
      return succesMessage(lot);
    } catch (error) {
      handleError(error);
    }
  }

  async update(
    id: string,
    updateLotDto: UpdateLotDto,
    files?: Express.Multer.File[],
  ) {
    try {
      // Check if lot exists
      const existingLot = await this.lotsRepo.findOne({ where: { id } });
      if (!existingLot) {
        throw new NotFoundException('Lot not found');
      }

      // Handle file uploads if provided
      if (files && files.length > 0) {
        // Delete old images if they exist
        if (existingLot.image_url && existingLot.image_url.length > 0) {
          await this.fileService.deleteFiles(existingLot.image_url);
        }

        // Upload new images
        const imageUrl = await this.fileService.createFiles(files);
        (updateLotDto as any).image_url = imageUrl;
      }

      await this.lotsRepo.update(id, updateLotDto);
      const updatedLot = await this.lotsRepo.findOne({ where: { id } });

      return succesMessage(updatedLot!);
    } catch (error) {
      handleError(error);
    }
  }

  async remove(id: string) {
    try {
      const lot = await this.lotsRepo.findOne({ where: { id } });
      if (!lot) {
        throw new NotFoundException('Lot not found');
      }

      // Delete associated images if they exist
      if (lot.image_url && lot.image_url.length > 0) {
        await this.fileService.deleteFiles(lot.image_url);
      }

      await this.lotsRepo.delete(id);
      return succesMessage({ message: 'Lot deleted successfully' });
    } catch (error) {
      handleError(error);
    }
  }
}
