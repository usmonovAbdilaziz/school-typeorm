import { Module } from '@nestjs/common';
import { LotCommetsService } from './lot_commets.service';
import { LotCommetsController } from './lot_commets.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LotCommet } from './entities/lot_commet.entity';
import { LotsModule } from '../lots/lots.module';
import { BuyerModule } from '../buyer/buyer.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([LotCommet]),
    LotsModule,
    BuyerModule,
    AuthModule,
  ],
  controllers: [LotCommetsController],
  providers: [LotCommetsService],
})
export class LotCommetsModule {}
