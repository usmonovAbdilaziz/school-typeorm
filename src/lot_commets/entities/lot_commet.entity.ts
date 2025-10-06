import { Buyer } from 'src/buyer/entities/buyer.entity';
import { Lot } from 'src/lots/entities/lot.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity('lot_comments')
export class LotCommet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: false })
  commet: string;

  @Column()
  buyer_id: string;

  @Column()
  lot_id: string;

  @ManyToOne(() => Buyer, (buyer) => buyer.comments, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'buyer_id' })
  buyer: Buyer;

  @ManyToOne(() => Lot, (lot) => lot.comments, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'lot_id' })
  lot: Lot;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
