import { Admin } from 'src/admins/entities/admin.entity';
import { Lot } from 'src/lots/entities/lot.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';

@Entity('sellers')
export class Seller {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  admin_id: string;

  @Column({ type:'varchar' })
  starting_bit: string;

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
