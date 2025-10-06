import { AucsionResault } from 'src/aucsion_resaults/entities/aucsion_resault.entity';
import { LotCommet } from 'src/lot_commets/entities/lot_commet.entity';
import { LotInterested } from 'src/lot_interested/entities/lot_interested.entity';
import { Payment } from 'src/payments/entities/payment.entity';
import { BuyerStatus } from 'src/roles/roles';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';

@Entity('buyers')
export class Buyer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  full_name: string;

  @Column({ type: 'varchar' })
  password: string;

  @Column({ length: 180, unique: true })
  email: string;

  @Column({ type: 'enum', enum: BuyerStatus, default: BuyerStatus.Pending })
  buyerStatus: BuyerStatus;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => LotCommet, (comment) => comment.buyer)
  comments: LotCommet[];

  @OneToMany(() => LotInterested, (interest) => interest.buyer)
  interests: LotInterested[];

  @OneToMany(() => AucsionResault, (result) => result.buyer)
  results: AucsionResault[];

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
