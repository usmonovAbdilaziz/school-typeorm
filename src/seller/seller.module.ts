import { Module } from '@nestjs/common';
import { SellerService } from './seller.service';
import { SellerController } from './seller.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Seller } from './entities/seller.entity';
import { FileModule } from 'src/file/file.module';
import { Crypto } from 'src/helpers/hashed.pass';
import { AdminsModule } from 'src/admins/admins.module';

@Module({
  imports: [TypeOrmModule.forFeature([Seller]), FileModule,AdminsModule],
  controllers: [SellerController],
  providers: [SellerService, Crypto],
  exports:[SellerService]
})
export class SellerModule {}
