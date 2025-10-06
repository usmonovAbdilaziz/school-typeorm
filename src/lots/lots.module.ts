import { Module } from '@nestjs/common';
import { LotsService } from './lots.service';
import { LotsController } from './lots.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lot } from './entities/lot.entity';
import { SellerModule } from 'src/seller/seller.module';

@Module({
  imports:[TypeOrmModule.forFeature([Lot]),SellerModule],
  controllers: [LotsController],
  providers: [LotsService],
  exports:[LotsService]
})
export class LotsModule {}
