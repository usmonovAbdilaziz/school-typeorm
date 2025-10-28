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
import { CardsService } from './cards.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { AuthGuard } from '../guard/auth-guard';
import { BuyerGuard } from '../guard/buyer-guard';

@Controller('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Post()
  // @UseGuards(AuthGuard, BuyerGuard)
  create(@Body() createCardDto: CreateCardDto) {
    return this.cardsService.create(createCardDto);
  }

  @Get()
  // @UseGuards(AuthGuard, BuyerGuard)
  findAll() {
    return this.cardsService.findAll();
  }

  @Get(':id')
  // @UseGuards(AuthGuard, BuyerGuard)
  findOne(@Param('id') id: string) {
    return this.cardsService.findOne(id);
  }
  @Get(':id')
  // @UseGuards(AuthGuard, BuyerGuard)
  cardsId(@Param('id') id: string) {
    return this.cardsService.cardsId(id);
  }

  @Patch(':id')
  // @UseGuards(AuthGuard, BuyerGuard)
  update(@Param('id') id: string, @Body() updateCardDto: UpdateCardDto) {
    return this.cardsService.update(id, updateCardDto);
  }

  @Delete(':id')
  // @UseGuards(AuthGuard, BuyerGuard)
  remove(@Param('id') id: string) {
    return this.cardsService.remove(id);
  }
}
