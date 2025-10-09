import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Buyer } from '../../buyer/entities/buyer.entity';
@Entity('cards')
export class Card {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 16 })
  card_number: string;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'varchar', length: 3 })
  cvc: string;

  @ManyToOne(() => Buyer, (buyer) => buyer.cards, { eager: true })
  buyer: Buyer;

  @CreateDateColumn()
  created_at: Date;
}
