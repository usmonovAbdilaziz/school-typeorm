import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { LotCommet } from '../../lot_commets/entities/lot_commet.entity';
import { LotInterested } from '../../lot_interested/entities/lot_interested.entity';
import { AucsionResault } from '../../aucsion_resaults/entities/aucsion_resault.entity';
import { Aucsion } from '../../aucsion/entities/aucsion.entity';
import { LotStatus, SellerType } from '../../roles/roles';
import { Admin } from '../../admins/entities/admin.entity';

@Entity('lots')
export class Lot {
  @PrimaryGeneratedColumn('uuid')
  id: string;

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

  @Column({ type: 'varchar' })
  address: string;

  @Column({ type: 'boolean', default: true })
  isPlaying: boolean;

  @Column({ type: 'date' })
  start_time: Date;

  @Column({ nullable: true })
  admin_id: string;

  @Column({ type: 'json', nullable: true })
  image_url: string[];

  @OneToMany(() => LotCommet, (comment) => comment.lot)
  comments: LotCommet[];

  @OneToMany(() => AucsionResault, (result) => result.lot)
  results: AucsionResault[];

  @OneToMany(() => LotInterested, (interest) => interest.lot)
  interests: LotInterested[];

  @ManyToOne(() => Aucsion, (aucsion) => aucsion.lots)
  aucsion: Aucsion;

  @ManyToOne(() => Admin, (admin) => admin.lots, {
    nullable: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'admin_id' })
  admin: Admin;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Removed seller relationship and seller_id column
  // All seller fields are now directly in the Lot entity
}
