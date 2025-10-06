import { Buyer } from 'src/buyer/entities/buyer.entity';
import { Lot } from 'src/lots/entities/lot.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';


@Entity('lot_interests')
export class LotInterested {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({type:'varchar'})
  buyer_id: string;

  @Column({type:'varchar'})
  lot_id: string;

  @Column({type:'boolean',default:false})
  isChecked: boolean;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => Buyer, (buyer) => buyer.interests, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'buyer_id' })
  buyer: Buyer;

  @ManyToOne(() => Lot, (lot) => lot.interests, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'lot_id' })
  lot: Lot;
}
