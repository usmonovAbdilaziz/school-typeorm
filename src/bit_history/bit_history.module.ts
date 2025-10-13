import { BitHistoryController } from './bit_history.controller';
import { AucsionModule } from '../aucsion/aucsion.module';
import { BitHistoryService } from './bit_history.service';
import { BidHisory } from './entities/bit_history.entity';
import { BuyerModule } from '../buyer/buyer.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

@Module({
  imports:[TypeOrmModule.forFeature([BidHisory]),BuyerModule,AucsionModule],
  controllers: [BitHistoryController],
  providers: [BitHistoryService],
})
export class BitHistoryModule {}
