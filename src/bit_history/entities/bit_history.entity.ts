// src/bids/entities/bid.entity.ts
import { Buyer } from '../../buyer/entities/buyer.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('bit-history')
export class BidHisory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'jsonb',default:[] })
  lotAction: {
    buyerId: string;
    amount: number;
    actionTime: Date;
  }[];

  @Column({ type: 'varchar',nullable:true })
  lotId: string;

  @CreateDateColumn()
  createdAt: Date;
  bit: never[];
}
