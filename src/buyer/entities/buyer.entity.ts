import { Payment } from '../../payments/entities/payment.entity';
import { AucsionResault } from '../../aucsion_resaults/entities/aucsion_resault.entity';
import { Card } from '../../cards/entities/card.entity';
import { BuyerStatus, SellerType } from '../../roles/roles';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Lot } from '../../lots/entities/lot.entity';

@Entity('buyers')
export class Buyer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  full_name: string;

  @Column({ type: 'varchar' })
  password: string;

  @Column({ type: 'varchar' })
  hash: string;

  @Column({ length: 180, unique: true })
  email: string;

  @Column({ type: 'enum',nullable: true, enum: SellerType })
  interested: SellerType;

  @Column({ type: 'enum', enum: BuyerStatus, default: BuyerStatus.Pending })
  buyerStatus: BuyerStatus;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @OneToMany(() => AucsionResault, (result) => result.buyer)
  results: AucsionResault[];

  @OneToMany(() => Card, (card) => card.buyer)
  cards: Card[];

  @OneToMany(() => Payment, (payment) => payment.buyer)
  payments: Payment[];

  @ManyToMany(() => Lot, (data) => data.buyers)
  lots: Lot[];
}
