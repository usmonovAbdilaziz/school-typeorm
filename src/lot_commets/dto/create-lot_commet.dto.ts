import { Column, CreateDateColumn, PrimaryGeneratedColumn } from 'typeorm';

export class CreateLotCommetDto {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  lot_id: string;

  @Column({ type: 'varchar' })
  buyer_id: string;

  @Column({ type: 'varchar' })
  commet: string;

  @CreateDateColumn()
  commeted_at: Date;
}
