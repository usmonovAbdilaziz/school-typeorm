import { Module } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CardsController } from './cards.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Card } from './entities/card.entity';
import { BuyerModule } from '../buyer/buyer.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Card]), BuyerModule,AuthModule],
  controllers: [CardsController],
  providers: [CardsService],
  exports:[CardsService]
})
export class CardsModule {}
