import { AdminsController } from './admins.controller';
import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { AdminsService } from './admins.service';
import { Crypto } from '../helpers/hashed.pass';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from './entities/admin.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Admin]), forwardRef(() => AuthModule)],
  controllers: [AdminsController],
  providers: [AdminsService, Crypto],
  exports: [Crypto, AdminsService],
})
export class AdminsModule {}
