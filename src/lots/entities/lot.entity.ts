import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Seller } from '../../seller/entities/seller.entity';
import { LotCommet } from '../../lot_commets/entities/lot_commet.entity';
import { LotInterested } from '../../lot_interested/entities/lot_interested.entity';
import { LotStatus } from 'src/roles/roles';
import { AucsionResault } from 'src/aucsion_resaults/entities/aucsion_resault.entity';

@Entity('lots')
export class Lot {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'enum', enum: LotStatus, default: LotStatus.Pending })
  status: LotStatus;

  @OneToMany(() => LotCommet, (comment) => comment.lot)
  comments: LotCommet[];

  @OneToMany(() => AucsionResault, (result) => result.lot)
  results: AucsionResault[];

  @OneToMany(() => LotInterested, (interest) => interest.lot)
  interests: LotInterested[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column()
  seller_id: string;

  @ManyToOne(() => Seller, (seller) => seller.lots, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'seller_id' })
  seller: Seller;
}
