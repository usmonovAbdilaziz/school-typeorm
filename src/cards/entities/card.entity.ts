import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
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

  @Column({ type: 'varchar' })
  buyer_id: string;

  // nullable true qilish orqali synchronize xatosini oldini olamiz
  @ManyToOne(() => Buyer, (buyer) => buyer.cards, {
    nullable: true, // eski null qiymatlar bilan moslashadi
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'buyer_id' })
  buyer: Buyer;

  @CreateDateColumn()
  created_at: Date;
}
