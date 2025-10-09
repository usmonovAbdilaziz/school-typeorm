import { Admin } from '../../admins/entities/admin.entity';
import { Lot } from '../../lots/entities/lot.entity';
import { LotStatus, SellerType } from '../../roles/roles';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

@Entity('sellers')
export class Seller {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  admin_id: string;

  @Column({ type: 'varchar' })
  starting_bit: string;

  @Column({ type: 'varchar' })
  description: string;

  @Column({ type: 'varchar' })
  tool_name: string;

  @Column({ type: 'enum', enum: SellerType })
  tool_type: SellerType;

  @Column({ type: 'enum', enum: LotStatus, default: LotStatus.Pending })
  status: LotStatus;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Admin, (admin) => admin.sellers, {
    nullable: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'admin_id' })
  admin: Admin;

  @OneToMany(() => Lot, (lot) => lot.seller)
  lots: Lot[];

  @Column({ type: 'json', nullable: true })
  image_url: string[];
}
