import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { BuyerService } from './buyer.service';
import { CreateBuyerDto } from './dto/create-buyer.dto';
import { UpdateBuyerDto } from './dto/update-buyer.dto';
import { AuthGuard } from '../guard/auth-guard';
import { BuyerGuard } from '../guard/buyer-guard';

@Controller('buyer')
export class BuyerController {
  constructor(private readonly buyerService: BuyerService) {}

  @Post()
  create(@Body() createBuyerDto: CreateBuyerDto) {
    return this.buyerService.create(createBuyerDto);
  }
  
  @Get()
  @UseGuards(AuthGuard, BuyerGuard)
  findAll() {
    return this.buyerService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard, BuyerGuard)
  findOne(@Param('id') id: string) {
    return this.buyerService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard, BuyerGuard)
  update(@Param('id') id: string, @Body() updateBuyerDto: UpdateBuyerDto) {
    return this.buyerService.update(id, updateBuyerDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, BuyerGuard)
  remove(@Param('id') id: string) {
    return this.buyerService.remove(id);
  }
}
