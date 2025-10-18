// src/bids/entities/bid.entity.ts
import { Buyer } from '../../buyer/entities/buyer.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class BidHisory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'json' })
  lotAction: {
    buyerId: string;
    amount: number;
    actionTime: Date;
  };

  @Column({ type: 'varchar' })
  lotId: string;

  @CreateDateColumn()
  createdAt: Date;
  bit: never[];
}
