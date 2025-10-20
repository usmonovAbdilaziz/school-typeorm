import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  UploadedFile,
} from '@nestjs/common';
import { LotsService } from './lots.service';
import { CreateLotDto } from './dto/create-lot.dto';
import { UpdateLotDto } from './dto/update-lot.dto';
import { AuthGuard } from '../guard/auth-guard';
import { RolesGuard } from '../guard/roles-guard';
import {
  FileFieldsInterceptor,
  FileInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
import { AuctionStatus } from 'src/roles/roles';

@Controller('lots')
export class LotsController {
  constructor(private readonly lotsService: LotsService) {}
  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'images', maxCount: 10 },
      { name: 'lotFile', maxCount: 1 },
    ]),
  )
  async create(
    @Body() createLotDto: CreateLotDto,
    @UploadedFiles()
    files: {
      images?: Express.Multer.File[];
      lotFile?: Express.Multer.File[];
    },
  ) {
    const images = files.images || [];
    const lotFile = files.lotFile?.[0];

    return this.lotsService.create(createLotDto, images, lotFile);
  }

  @Get()
  findAll() {
    return this.lotsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lotsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @UseInterceptors(FilesInterceptor('files'))
  update(
    @Param('id') id: string,
    @Body() updateLotDto: UpdateLotDto,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    return this.lotsService.update(id, updateLotDto, files);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  remove(@Param('id') id: string) {
    return this.lotsService.remove(id);
  }
  @Post(':lotId/apply')
  async applyToLot(
    @Param('lotId') lotId: string,
    @Body('buyerId') buyerId: string,
  ) {
    return this.lotsService.applyToLot(lotId, buyerId);
  }
  @Delete(':lotId/remove')
  removeFromLot(
    @Param('lotId') lotId: string,
    @Body('buyerId') buyerId: string,
  ) {
    return this.lotsService.removeFromLot(lotId, buyerId);
  }
  @Get(':id')
  getLotBuyers(@Param('id') id: string) {
    return this.lotsService.getLotBuyers(id);
  }
  @Get(':id')
  getBuyerLots(@Param('id') id: string) {
    return this.lotsService.getBuyerLots(id);
  }
  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: AuctionStatus,
  ) {
      // service method chaqiriladi
      const updatedLot = await this.lotsService.updateLotStatus(id, status);
      return updatedLot;
    
  }
}
