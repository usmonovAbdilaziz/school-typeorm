import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from '@nestjs-modules/ioredis';

import { AdminsModule } from './admins/admins.module';
import { BuyerModule } from './buyer/buyer.module';
import { PaymentsModule } from './payments/payments.module';
import { LotsModule } from './lots/lots.module';
import { LotInterestedModule } from './lot_interested/lot_interested.module';
import { LotCommetsModule } from './lot_commets/lot_commets.module';
import { AucsionResaultsModule } from './aucsion_resaults/aucsion_resaults.module';
import { CardsModule } from './cards/cards.module';
import { AuthModule } from './auth/auth.module';
import { BitHistoryModule } from './bit_history/bit_history.module';
import { AucsionModule } from './aucsion/aucsion.module';
import { AuctionGateway } from './modules/auction/auction/auction.gateway';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true,
    }),

    RedisModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'single', // 👈 bu qo‘shimcha shart emas, lekin aniqlik kiritadi
        url: `redis://${configService.get('REDIS_HOST')}:${configService.get('REDIS_PORT')}`,
        readyLog: true,
        closeClient: true,
      }),
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
