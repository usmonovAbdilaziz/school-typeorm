import { AucsionResaultsModule } from './aucsion_resaults/aucsion_resaults.module';
import { LotInterestedModule } from './lot_interested/lot_interested.module';
import { AuctionGateway } from './modules/auction/auction/auction.gateway';
import { LotCommetsModule } from './lot_commets/lot_commets.module';
import { BitHistoryModule } from './bit_history/bit_history.module';
import { PaymentsModule } from './payments/payments.module';
import { AucsionModule } from './aucsion/aucsion.module';
import { AdminsModule } from './admins/admins.module';
import { BuyerModule } from './buyer/buyer.module';
import { CardsModule } from './cards/cards.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LotsModule } from './lots/lots.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';

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
      synchronize: true, // Disable synchronization for production
      entities: ['src/**/*.entity.{ts,js}'],
    }),
    AdminsModule,
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
  providers: [AuctionGateway],
})
export class AppModule {}
