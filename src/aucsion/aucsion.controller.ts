import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AucsionService } from './aucsion.service';
import { CreateAucsionDto } from './dto/create-aucsion.dto';
import { UpdateAucsionDto } from './dto/update-aucsion.dto';

@Controller('aucsion')
export class AucsionController {
  constructor(private readonly aucsionService: AucsionService) {}

  @Post()
  create(@Body() createAucsionDto: CreateAucsionDto) {
    return this.aucsionService.create(createAucsionDto);
  }

  @Get()
  findAll() {
    return this.aucsionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.aucsionService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAucsionDto: UpdateAucsionDto) {
    return this.aucsionService.update(id, updateAucsionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.aucsionService.remove(id);
  }
}
