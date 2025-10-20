import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { AuctionStatus, SellerType } from '../../roles/roles';
import { Buyer } from '../../buyer/entities/buyer.entity';
import { Admin } from '../../admins/entities/admin.entity';
import { AucsionResault } from '../../aucsion_resaults/entities/aucsion_resault.entity';

@Entity('lots')
export class Lot {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  starting_bit: string; //boshlang'ich summa

  @Column({ type: 'json' }) // lot6 haqida malumotlar
  description: {
    key: string;
    val: string;
  };

  @Column({ type: 'varchar' }) // lot noimi kimtomonidan quyilmoqda info
  tool_name: string;

  @Column({ type: 'enum', enum: SellerType }) //qaysi tipga kirishi
  tool_type: SellerType;

  @Column({ type: 'varchar' }) // lot uynaladigan hudud
  address: string;

  @Column({
    type: 'enum',
    enum: AuctionStatus,
    default: AuctionStatus.PENDING,//yaratilganda pending buladi uynalayotganda playing yutilsa played agar uyin tuxtatilsa cancelled buladi
  })
  status: AuctionStatus; //lot uchun  PENDING PLAYING PLAYED CANCELLED xolatlari

  @Column({ type: 'boolean', default: false })
  isActive: boolean; // true bulsa admin aucsion ga kiritgan buladi aucsion tugagach false buladi yana kein uynalganlarga qushiladi

  @Column({ type: 'integer' }) // layklar bilan lotga bulgan qiziqishni kurish
  likesCount: number;

  @Column({ type: 'date' }) //aucsion boshlanish kuni
  start_time: Date;

  @Column({ nullable: true }) // kim tomonidan yaratilgan bu lot
  admin_id: string;

  @Column({ nullable: true }) // qaysi lotga ariza berganini bilish uchun va userni uzida kursatish uchun
  buyer_id?: string;

  @Column({ type: 'json', nullable: true }) //lot uchun rasimlar
  image_url: string[];

  @Column({ type: 'json', nullable: true }) //lot uchun info file
  lotFile: string;

   @OneToMany(() => AucsionResault, (result) => result.lot)
  result: AucsionResault;

  @ManyToMany(() => Buyer, (buyer) => buyer.lots, { cascade: true })
  @JoinTable({
    name: 'lot_buyers', // o‘rta jadval nomi
    joinColumn: { name: 'lot_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'buyer_id', referencedColumnName: 'id' },
  })
  buyers: Buyer[]; //user bilan kupga kup bog'lanish

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
