import { Module } from '@nestjs/common';
import { AucsionResaultsService } from './aucsion_resaults.service';
import { AucsionResaultsController } from './aucsion_resaults.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AucsionResault } from './entities/aucsion_resault.entity';
import { LotsModule } from 'src/lots/lots.module';
import { BuyerModule } from 'src/buyer/buyer.module';

@Module({
  imports:[TypeOrmModule.forFeature([AucsionResault]),LotsModule,BuyerModule],
  controllers: [AucsionResaultsController],
  providers: [AucsionResaultsService],
})
export class AucsionResaultsModule {}
