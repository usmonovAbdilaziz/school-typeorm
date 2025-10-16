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
} from '@nestjs/common';
import { LotsService } from './lots.service';
import { CreateLotDto } from './dto/create-lot.dto';
import { UpdateLotDto } from './dto/update-lot.dto';
import { AuthGuard } from '../guard/auth-guard';
import { RolesGuard } from '../guard/roles-guard';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('lots')
export class LotsController {
  constructor(private readonly lotsService: LotsService) {}

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @UseInterceptors(FilesInterceptor('files'))
  create(
    @Body() createLotDto: CreateLotDto,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    return this.lotsService.create(createLotDto, files);
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
}
