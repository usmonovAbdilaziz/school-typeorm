// src/bids/entities/bid.entity.ts

import { Aucsion } from '../../aucsion/entities/aucsion.entity';
import { Buyer } from '../../buyer/entities/buyer.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class BidHisory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  amount: number;

  @Column({ type: 'varchar' })
  buyerId: string;
  
  @ManyToOne(() => Buyer, (buyer) => buyer.bids, { eager: true })
  buyer: Buyer;

  @Column({ type: 'varchar' })
  aucsionId: string;

  @ManyToOne(() => Aucsion, (auction) => auction.bids)
  aucsion: Aucsion;

  @CreateDateColumn()
  createdAt: Date;
}
