import { Buyer } from '../../buyer/entities/buyer.entity';
import { Lot } from '../../lots/entities/lot.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('aucsion-resaults')
export class AucsionResault {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  lot_id: string;

  @Column({ type: 'varchar' })
  buyer_id: string;

  @Column({ type: 'varchar' })
  final_price: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Buyer, (buyer) => buyer.results, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'buyer_id' })
  buyer: Buyer;

  @ManyToOne(() => Lot, (lot) => lot.results, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'lot_id' })
  lot: Lot;
}
