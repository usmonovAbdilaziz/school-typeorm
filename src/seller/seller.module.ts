import { Module } from '@nestjs/common';
import { SellerService } from './seller.service';
import { SellerController } from './seller.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Seller } from './entities/seller.entity';
import { FileModule } from '../file/file.module';
import { Crypto } from '../helpers/hashed.pass';
import { AdminsModule } from '../admins/admins.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Seller]),
    FileModule,
    AdminsModule,
    AuthModule,
  ],
  controllers: [SellerController],
  providers: [SellerService, Crypto],
  exports: [SellerService],
})
export class SellerModule {}
