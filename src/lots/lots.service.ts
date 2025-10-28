import {
  ConflictException,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Lot } from './entities/lot.entity';
import { Buyer } from '../buyer/entities/buyer.entity';
import { Admin } from '../admins/entities/admin.entity';
import { CreateLotDto } from './dto/create-lot.dto';
import { UpdateLotDto } from './dto/update-lot.dto';
import { handleError, succesMessage } from '../helpers/response';
import { FileService } from '../file/file.service';
import { AuctionStatus } from '../roles/roles';

@Injectable()
export class LotsService {
  constructor(
    @InjectRepository(Lot) private readonly lotsRepo: Repository<Lot>,
    @InjectRepository(Buyer) private readonly buyerRepo: Repository<Buyer>,
    @InjectRepository(Admin) private readonly adminRepo: Repository<Admin>,
    private readonly fileService: FileService,
    private readonly dataSource: DataSource,
  ) {}

  // ==================== CRUD ====================

  async create(
    createLotDto: CreateLotDto,
    images?: Express.Multer.File[],
    lotFile?: Express.Multer.File,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const admin = await this.adminRepo.findOne({
        where: { id: createLotDto.admin_id },
      });
      if (!admin) throw new NotFoundException('Admin not found');

      const existingLot = await this.lotsRepo.findOne({
        where: {
          tool_name: createLotDto.tool_name,
          tool_type: createLotDto.tool_type,
        },
      });
      if (existingLot) throw new ConflictException('Lot already exists');

      let imageUrls: string[] | undefined = undefined;
      if (images?.length) {
        imageUrls = await this.fileService.createFiles(images);
      }

      let lotFileUrl: string | undefined = undefined;
      if (lotFile) {
        lotFileUrl = await this.fileService.createFileToFile(lotFile);
      }

      const newLot = this.lotsRepo.create({
        ...createLotDto,
        image_url: imageUrls,
        lotFile: lotFileUrl,
        buyers: [],
        likesCount: Number(createLotDto.likesCount),
        status: AuctionStatus.PENDING,
        isActive: false,
      });

      await queryRunner.manager.save(newLot);
      await queryRunner.commitTransaction();

      return succesMessage(newLot, 201);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      handleError(error);
    } finally {
      await queryRunner.release();
    }
  }

  async findAll() {
    try {
      const lots = await this.lotsRepo.find({
        relations: ['buyers', 'admin'],
        order: { created_at: 'DESC' },
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
        relations: ['buyers', 'admin'],
      });
      if (!lot) throw new NotFoundException('Lot not found');
      return succesMessage(lot);
    } catch (error) {
      handleError(error);
    }
  }

  async update(
    id: string,
    updateLotDto: UpdateLotDto,
    images?: Express.Multer.File[],
    lotFile?: Express.Multer.File,
  ) {
    
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const lot = await this.lotsRepo.findOne({ where: { id } });
      if (!lot) throw new NotFoundException('Lot not found');

      const updateData: any = { ...updateLotDto };

      if (images?.length) {
        if (lot.image_url?.length) {
          await this.fileService.deleteFiles(lot.image_url);
        }
        updateData.image_url = await this.fileService.createFiles(images);
      }

      if (lotFile) {
        if (lot.lotFile) {
          await this.fileService.deleteFiles([lot.lotFile]);
        }
        updateData.lotFile = await this.fileService.createFileToFile(lotFile);
      }
      if (typeof updateLotDto.likesCount !== 'undefined') {        
        lot.likesCount = (lot.likesCount || 0) + updateLotDto.likesCount;
        this.lotsRepo.save(lot)
      }


      await queryRunner.manager.update(Lot, id, updateData);
      const updatedLot: any = await queryRunner.manager.findOne(Lot, {
        where: { id },
        relations: ['buyers'],
      });

      await queryRunner.commitTransaction();
      return succesMessage(updatedLot);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      handleError(error);
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const lot = await this.lotsRepo.findOne({ where: { id } });
      if (!lot) throw new NotFoundException('Lot not found');

      if (lot.image_url?.length) {
        await this.fileService.deleteFiles(lot.image_url);
      }
      if (lot.lotFile) {
        await this.fileService.deleteFiles([lot.lotFile]);
      }

      await queryRunner.manager.delete(Lot, id);
      await queryRunner.commitTransaction();

      return succesMessage({ message: 'Lot deleted' });
    } catch (error) {
      await queryRunner.rollbackTransaction();
      handleError(error);
    } finally {
      await queryRunner.release();
    }
  }

  // ==================== BUYERS ====================

  async applyToLot(lotId: string, buyerId: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const lot = await this.lotsRepo.findOne({
        where: { id: lotId },
        relations: ['buyers'], // MUHIM
      });
      if (!lot) throw new NotFoundException('Lot not found');

      const buyer = await this.buyerRepo.findOne({ where: { id: buyerId } });
      if (!buyer) throw new NotFoundException('Buyer not found');

      // Eski buyers ni saqlaymiz
      const alreadyApplied = lot.buyers.some((b) => b.id === buyerId);
      if (alreadyApplied) throw new ConflictException('Already applied');

      // ✅ Eski massivni saqlab, yangi buyer qo‘shamiz
      lot.buyers = [...(lot.buyers || []), buyer];

      await queryRunner.manager.save(lot);
      await queryRunner.commitTransaction();

      return succesMessage({ message: 'Applied successfully' });
    } catch (error) {
      await queryRunner.rollbackTransaction();
      handleError(error);
    } finally {
      await queryRunner.release();
    }
  }
  // ==================== STATUS ====================

  async updateLotStatus(lotId: string, status: AuctionStatus) {
    try {
      const lot = await this.lotsRepo.findOne({ where: { id: lotId } });
      if (!lot) throw new NotFoundException('Lot not found');

      lot.status = status;
      lot.isActive = status === AuctionStatus.PLAYING;

      await this.lotsRepo.save(lot);
      return succesMessage(lot);
    } catch (error) {
      handleError(error);
    }
  }
}
