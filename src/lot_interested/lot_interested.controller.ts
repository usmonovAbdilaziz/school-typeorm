import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LotInterestedService } from './lot_interested.service';
import { CreateLotInterestedDto } from './dto/create-lot_interested.dto';
import { UpdateLotInterestedDto } from './dto/update-lot_interested.dto';

@Controller('lot-interested')
export class LotInterestedController {
  constructor(private readonly lotInterestedService: LotInterestedService) {}

  @Post()
  create(@Body() createLotInterestedDto: CreateLotInterestedDto) {
    return this.lotInterestedService.create(createLotInterestedDto);
  }

  @Get()
  findAll() {
    return this.lotInterestedService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lotInterestedService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLotInterestedDto: UpdateLotInterestedDto) {
    return this.lotInterestedService.update(id, updateLotInterestedDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.lotInterestedService.remove(id);
  }
}
