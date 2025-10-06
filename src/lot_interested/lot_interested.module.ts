import { Module } from '@nestjs/common';
import { LotInterestedService } from './lot_interested.service';
import { LotInterestedController } from './lot_interested.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LotInterested } from './entities/lot_interested.entity';
import { BuyerModule } from 'src/buyer/buyer.module';
import { LotsModule } from 'src/lots/lots.module';

@Module({
  imports:[TypeOrmModule.forFeature([LotInterested]),BuyerModule,LotsModule],
  controllers: [LotInterestedController],
  providers: [LotInterestedService],
})
export class LotInterestedModule {}
