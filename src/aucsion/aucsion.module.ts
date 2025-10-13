import { Module } from '@nestjs/common';
import { AucsionService } from './aucsion.service';
import { AucsionController } from './aucsion.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Aucsion } from './entities/aucsion.entity';
import { LotsModule } from '../lots/lots.module';
import { AdminsModule } from '../admins/admins.module';

@Module({
  imports:[TypeOrmModule.forFeature([Aucsion]),LotsModule,AdminsModule],
  controllers: [AucsionController],
  providers: [AucsionService],
  exports:[AucsionService]
})
export class AucsionModule {}
