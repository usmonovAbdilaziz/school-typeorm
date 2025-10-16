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

      // Check if buyer exists
     const buyer= await this.buyerService.findOne(buyer_id);
     if(!buyer){
      throw new NotFoundException('Buyer not found')
     }

      // Check if card already exists
      const existingCard = await this.cardRepo.findOne({
        where: { card_number, cvc },
      });
      if (existingCard) {
        throw new ConflictException('This card already exists');
      }

      // Validate card expiration date
      const now = new Date();
      const currentMonth = now.getMonth() + 1; // 0-based
      const currentYear = now.getFullYear();
      const [expYear, expMonth] = date.toString().split('-').map(Number);

      if (expYear < currentYear) {
        throw new ConflictException('Card expiration year has passed');
      }

      if (expYear === currentYear && expMonth < currentMonth) {
        throw new ConflictException('Card expiration month has passed');
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
      const cards = await this.cardRepo.find({
        relations: ['buyer'],
      });
      return succesMessage(cards);
    } catch (error) {
      handleError(error);
    }
  }

  async findOne(id: string) {
    try {
      const card = await this.cardRepo.findOne({
        where: { buyer_id:id },
        relations: ['buyer'],
      });
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
      // Validate card exists
      await this.findOne(id);

      // Update card
      await this.cardRepo.update(id, updateCardDto);
      const updatedCard = await this.findOne(id);
      return updatedCard;
    } catch (error) {
      handleError(error);
    }
  }

  async remove(id: string) {
    try {
      // Validate card exists
      await this.findOne(id);

      // Remove card
      await this.cardRepo.delete(id);
      return succesMessage({ message: 'Card deleted successfully' });
    } catch (error) {
      handleError(error);
    }
  }
}
