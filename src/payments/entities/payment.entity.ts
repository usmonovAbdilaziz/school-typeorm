import { Buyer } from '../../buyer/entities/buyer.entity';
import { BuyerStatus, Currency } from '../../roles/roles';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  buyer_id: string;

  @ManyToOne(() => Buyer, (buyer) => buyer.payments, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'buyer_id' })
  buyer: Buyer;

  @Column({ type: 'varchar' })
  provider: string;

  @Column({ type: 'integer' })
  amount: number;

  @Column({ type: 'varchar',nullable:true })
  card_id: string;

  @Column({ type: 'varchar' })
  providerTransactionId: string;

  @Column({ type: 'enum', enum: Currency, default: Currency.USD })
  currency: Currency;

  @Column({ type: 'enum', enum: BuyerStatus, default: BuyerStatus.Pending })
  buyerStatus: BuyerStatus;

  @Column({ type: 'json' })
  metadata: JSON;

  @CreateDateColumn()
  created_at: Date;
}
