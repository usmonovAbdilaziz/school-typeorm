import { Module } from '@nestjs/common';
import { LotsService } from './lots.service';
import { LotsController } from './lots.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lot } from './entities/lot.entity';
import { AuthModule } from '../auth/auth.module';
import { AdminsModule } from '../admins/admins.module';
import { FileModule } from '../file/file.module';
import { BuyerModule } from '../buyer/buyer.module';
import { Buyer } from '../buyer/entities/buyer.entity';
import { Admin } from '../admins/entities/admin.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Lot,Buyer,Admin]),
    AuthModule,
    AdminsModule,
    FileModule,
    BuyerModule
  ],
  controllers: [LotsController],
  providers: [LotsService],
  exports: [LotsService],
})
export class LotsModule {}
