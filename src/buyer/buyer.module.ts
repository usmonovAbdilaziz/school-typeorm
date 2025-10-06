import { Module } from '@nestjs/common';
import { BuyerService } from './buyer.service';
import { BuyerController } from './buyer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Buyer } from './entities/buyer.entity';
import { Crypto } from '../helpers/hashed.pass';

@Module({
  imports: [TypeOrmModule.forFeature([Buyer])],
  controllers: [BuyerController],
  providers: [BuyerService, Crypto],
  exports:[BuyerService]
})
export class BuyerModule {}
