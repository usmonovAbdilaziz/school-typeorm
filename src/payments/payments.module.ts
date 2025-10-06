import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { BuyerModule } from 'src/buyer/buyer.module';
import { StripeProvider } from 'src/stripe/stripe.providers';
import { SellerModule } from 'src/seller/seller.module';

@Module({
  imports:[TypeOrmModule.forFeature([Payment]),BuyerModule,SellerModule],
  controllers: [PaymentsController],
  providers: [PaymentsService,StripeProvider],
})
export class PaymentsModule {}
