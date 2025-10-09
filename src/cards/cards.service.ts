import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { handleError, succesMessage } from '../helpers/response';
import { InjectRepository } from '@nestjs/typeorm';
import { Card } from './entities/card.entity';
import { Repository } from 'typeorm';
import { BuyerService } from '../buyer/buyer.service';

@Injectable()
export class CardsService {
  constructor(
    @InjectRepository(Card) private readonly cardRepo: Repository<Card>,
    private readonly buyerService: BuyerService,
  ) {}
  async create(createCardDto: CreateCardDto) {
    try {
      const { buyer_id, card_number, cvc, date } = createCardDto;
      if (!(await this.buyerService.findOne(buyer_id)))
        throw new NotFoundException('Buyer not fount');
      if (await this.cardRepo.findOne({ where: { card_number, cvc } }))
        throw new ConflictException('This card already exists');

      const now = new Date();
      const currentMonth = now.getMonth() + 1; // 0-based
      const currentYear = now.getFullYear();
      const newDate = String(date).split('-');
      if (Number(newDate[0]) < currentYear) {
        throw new ConflictException('Karta muddati yy o‘tgan');
      }
      if (
        Number(newDate[0]) === currentYear &&
        Number(newDate[1]) < currentMonth
      ) {
        throw new ConflictException('Karta muddati mm o‘tgan');
      }
      const newCard = this.cardRepo.create(createCardDto);
      await this.cardRepo.save(newCard);
      return succesMessage(newCard, 201);
    } catch (error) {
      handleError(error);
    }
  }

  async findAll() {
    try {
      const cards = await this.cardRepo.find({ relations: ['buyer'] });
      return succesMessage(cards);
    } catch (error) {
      handleError(error);
    }
  }

  async findOne(id: string) {
    try {
      const card = await this.cardRepo.findOne({ where: { id } });
      if (!card) {
        throw new NotFoundException('Card not found');
      }
      return succesMessage(card);
    } catch (error) {
      handleError(error);
    }
  }

  async update(id: string, updateCardDto: UpdateCardDto) {
    try {
      await this.cardRepo.update(id, updateCardDto);
      const newCard = await this.findOne(id);
      return newCard;
    } catch (error) {
      handleError(error);
    }
  }

  async remove(id: string) {
    try {
      await this.findOne(id);
      await this.cardRepo.delete(id);
      return succesMessage({ message: 'Deleted succesfully' });
    } catch (error) {
      handleError(error);
    }
  }
}
