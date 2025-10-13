import { AucsionResaultsModule } from './aucsion_resaults/aucsion_resaults.module';
// import { RedisModule } from '@nestjs-modules/ioredis';
import { LotInterestedModule } from './lot_interested/lot_interested.module';
import { LotInterested } from './lot_interested/entities/lot_interested.entity';
import { LotCommetsModule } from './lot_commets/lot_commets.module';
import { LotCommet } from './lot_commets/entities/lot_commet.entity';
import { Payment } from './payments/entities/payment.entity';
import { PaymentsModule } from './payments/payments.module';
import { Seller } from './seller/entities/seller.entity';
import { Admin } from './admins/entities/admin.entity';
import { AdminsModule } from './admins/admins.module';
import { Buyer } from './buyer/entities/buyer.entity';
import { SellerModule } from './seller/seller.module';
import { BuyerModule } from './buyer/buyer.module';
import { CardsModule } from './cards/cards.module';
import { Lot } from './lots/entities/lot.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LotsModule } from './lots/lots.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { BitHistoryModule } from './bit_history/bit_history.module';
import { AucsionModule } from './aucsion/aucsion.module';
import { Aucsion } from './aucsion/entities/aucsion.entity';
import { BidHisory } from './bit_history/entities/bit_history.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: String(process.env.DB_HOST),
      port: Number(process.env.DB_PORT),
      username: String(process.env.DB_USER),
      password: String(process.env.DB_PASS),
      database: String(process.env.DB_NAME),
      autoLoadEntities: true,
      synchronize: true,
      entities: [Admin, Seller, Buyer, Payment, Lot, LotInterested, LotCommet,Aucsion,BidHisory],
    }),
    AdminsModule,
    SellerModule,
    BuyerModule,
    PaymentsModule,
    LotsModule,
    LotInterestedModule,
    LotCommetsModule,
    AucsionResaultsModule,
    CardsModule,
    AuthModule,
    BitHistoryModule,
    AucsionModule,
     ],
  // RedisModule.forRoot({
  //   type: 'single',
  //   url: 'redis://localhost:6379',
  //   options: {
  //     connectTimeout: 2000 * 60, // Ulanish vaqtini 20 soniyaga oshirish
  //     host: String(process.env.REDIS_HOST),
  //     port: Number(process.env.REDIS_PORT),
  //   },
  // }),
})
export class AppModule {}
