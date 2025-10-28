import { Module } from '@nestjs/common';
import { AuctionService } from './auction.service';
import {  AuctionGateway } from './auction.controller';
import { BitHistoryModule } from 'src/bit_history/bit_history.module';
import { LotsModule } from 'src/lots/lots.module';

@Module({
  imports: [BitHistoryModule,LotsModule],
  providers: [AuctionService, AuctionGateway],
})
export class AuctionModule {}
