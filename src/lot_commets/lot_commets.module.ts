import { Module } from '@nestjs/common';
import { LotCommetsService } from './lot_commets.service';
import { LotCommetsController } from './lot_commets.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LotCommet } from './entities/lot_commet.entity';
import { LotsModule } from 'src/lots/lots.module';
import { BuyerModule } from 'src/buyer/buyer.module';

@Module({
  imports:[TypeOrmModule.forFeature([LotCommet]),LotsModule,BuyerModule],
  controllers: [LotCommetsController],
  providers: [LotCommetsService],
})
export class LotCommetsModule {}
