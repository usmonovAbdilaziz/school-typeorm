import { Module } from '@nestjs/common';
import { LotsService } from './lots.service';
import { LotsController } from './lots.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lot } from './entities/lot.entity';
import { AuthModule } from '../auth/auth.module';
import { AdminsModule } from '../admins/admins.module';
import { FileModule } from '../file/file.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Lot]),
    AuthModule,
    AdminsModule,
    FileModule,
  ],
  controllers: [LotsController],
  providers: [LotsService],
  exports: [LotsService],
})
export class LotsModule {}
