// src/auction/entities/auction.entity.ts
import { BidHisory } from '../../bit_history/entities/bit_history.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Admin } from '../../admins/entities/admin.entity';
import { Lot } from '../../lots/entities/lot.entity';

@Entity('aucsion')
export class Aucsion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'varchar' })
  adminId: string;

  @Column({ type: 'varchar' })
  lotId: string;

  @ManyToOne(() => Admin, (admin) => admin.lots, {
    nullable: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'adminId' })
  admin: Admin;

  @OneToMany(() => BidHisory, (bid) => bid.aucsion)
  bids: BidHisory[];

  @OneToMany(() => Lot, (lot) => lot.aucsion)
  lots: Lot[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
