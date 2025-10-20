import { BitHistoryController } from './bit_history.controller';
import { BitHistoryService } from './bit_history.service';
import { BidHisory } from './entities/bit_history.entity';
import { BuyerModule } from '../buyer/buyer.module';
import { LotsModule } from '../lots/lots.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

@Module({
  imports: [TypeOrmModule.forFeature([BidHisory]), BuyerModule,LotsModule],
  controllers: [BitHistoryController],
  providers: [BitHistoryService],
  exports: [BitHistoryService],
})
export class BitHistoryModule {}
