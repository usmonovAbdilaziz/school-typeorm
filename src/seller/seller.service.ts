import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSellerDto } from './dto/create-seller.dto';
import { UpdateSellerDto } from './dto/update-seller.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Seller } from './entities/seller.entity';
import { Repository } from 'typeorm';
import { FileService } from '../file/file.service';
import { handleError, succesMessage } from '../helpers/response';
import { AdminsService } from '../admins/admins.service';

@Injectable()
export class SellerService {
  constructor(
    @InjectRepository(Seller) private readonly sellerRepo: Repository<Seller>,
    private readonly adminService: AdminsService,
    private readonly fileServise: FileService,
  ) {}
  async create(createSellerDto: CreateSellerDto, files: Express.Multer.File[]) {
    try {
      const { admin_id, tool_name, tool_type } = createSellerDto;
      const imageUrl = await this.fileServise.createFiles(files);
      const existsTool = await this.sellerRepo.findOne({
        where: { tool_name, tool_type },
      });
      if (existsTool) {
        throw new ConflictException('This tool already exista');
      }
      const admin = await this.adminService.findOne(admin_id);
      if (!admin) throw new NotFoundException('Admin not found');
      const newSeller = this.sellerRepo.create({
        ...createSellerDto,
        image_url: imageUrl,
      });
      await this.sellerRepo.save(newSeller);
      return succesMessage(newSeller, 201);
    } catch (error) {
      handleError(error);
    }
  }

  async findAll() {
    try {
      const sellers = await this.sellerRepo.find({
        relations: ['admin', 'lots'],
      });
      return succesMessage(sellers);
    } catch (error) {
      handleError(error);
    }
  }

  async findOne(id: string) {
    try {
      const seller = await this.sellerRepo.findOne({
        where: { id },
        relations: ['admin', 'lots'],
      });
      if (!seller) {
        throw new NotFoundException('Seller not found');
      }
      return succesMessage(seller);
    } catch (error) {
      handleError(error);
    }
  }

  async update(id: string, updateSellerDto: UpdateSellerDto) {
    try {
      await this.sellerRepo.update(id, updateSellerDto);
      const updatedSeller = await this.sellerRepo.findOne({ where: { id } });
      if (!updatedSeller) {
        throw new NotFoundException('Seller not found');
      }
      return succesMessage(updatedSeller!);
    } catch (error) {
      handleError(error);
    }
  }

  async remove(id: string) {
    try {
      const sellerData = await this.sellerRepo.findOne({ where: { id } });
      if (!sellerData) {
        throw new NotFoundException('Seller not found');
      }

      // Avval rasmlarni o‘chirish
      if (
        Array.isArray(sellerData.image_url) &&
        sellerData.image_url.length > 0
      ) {
        await this.fileServise.deleteFiles(sellerData.image_url);
      }

      // Keyin DB’dan seller’ni o‘chirish
      await this.sellerRepo.delete({ id });

      return succesMessage({ message: 'Seller deleted successfully' });
    } catch (error) {
      handleError(error);
    }
  }
}
