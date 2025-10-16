import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AdminsModule } from '../admins/admins.module';
import { BuyerModule } from '../buyer/buyer.module';
import { Token } from '../helpers/token';

@Module({
  imports: [
    forwardRef(() => AdminsModule),
    forwardRef(() => BuyerModule),
    JwtModule.register({
      secret: process.env.JWT_ACCESS_KEY as string,
      signOptions: { expiresIn: process.env.JWT_ACCESS_TIME as string },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, Token],
  exports: [Token, JwtModule],
})
export class AuthModule {}
