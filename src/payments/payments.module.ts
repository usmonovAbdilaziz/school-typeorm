import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { BuyerModule } from '../buyer/buyer.module';
import { StripeProvider } from '../stripe/stripe.providers';
import { AuthModule } from '../auth/auth.module';
import { LotsModule } from '../lots/lots.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment]),
    BuyerModule,
    LotsModule,
    AuthModule,
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService, StripeProvider],
})
export class PaymentsModule {}
