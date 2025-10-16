import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BitHistoryService } from './bit_history.service';
import { CreateBitHistoryDto } from './dto/create-bit_history.dto';
import { UpdateBitHistoryDto } from './dto/update-bit_history.dto';

@Controller('bit-history')
export class BitHistoryController {
  constructor(private readonly bitHistoryService: BitHistoryService) {}

  @Post()
  createdBit(@Body() createBitHistoryDto: CreateBitHistoryDto) {
    return this.bitHistoryService.create(createBitHistoryDto);
  }

  @Get()
  findAll() {
    return this.bitHistoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bitHistoryService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBitHistoryDto: UpdateBitHistoryDto,
  ) {
    return this.bitHistoryService.update(id, updateBitHistoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bitHistoryService.remove(id);
  }
}
