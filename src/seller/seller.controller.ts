import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { SellerService } from './seller.service';
import { CreateSellerDto } from './dto/create-seller.dto';
import { UpdateSellerDto } from './dto/update-seller.dto';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('seller')
export class SellerController {
  constructor(private readonly sellerService: SellerService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('files'))
  create(
    @Body() createSellerDto: CreateSellerDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    
    return this.sellerService.create(createSellerDto, files);
  }

  @Get()
  findAll() {
    return this.sellerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sellerService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSellerDto: UpdateSellerDto) {
    return this.sellerService.update(id, updateSellerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sellerService.remove(id);
  }
}
