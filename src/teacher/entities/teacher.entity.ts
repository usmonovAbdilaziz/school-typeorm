import { Group } from 'src/group/entities/group.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('teachers')
export class Teacher {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  full_name: string;

  @Column({ type: 'varchar' })
  specialist: string;

  @Column({ type: 'varchar', unique: true })
  phone_number: string;

  @ManyToOne(() => Group, (group) => group.teachers)
  @JoinColumn({ name: 'groupId' })
  group: Group;
}
