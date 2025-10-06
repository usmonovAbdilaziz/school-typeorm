import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LotCommetsService } from './lot_commets.service';
import { CreateLotCommetDto } from './dto/create-lot_commet.dto';
import { UpdateLotCommetDto } from './dto/update-lot_commet.dto';

@Controller('lot-commets')
export class LotCommetsController {
  constructor(private readonly lotCommetsService: LotCommetsService) {}

  @Post()
  create(@Body() createLotCommetDto: CreateLotCommetDto) {
    return this.lotCommetsService.create(createLotCommetDto);
  }

  @Get()
  findAll() {
    return this.lotCommetsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lotCommetsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLotCommetDto: UpdateLotCommetDto) {
    return this.lotCommetsService.update(id, updateLotCommetDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.lotCommetsService.remove(id);
  }
}
