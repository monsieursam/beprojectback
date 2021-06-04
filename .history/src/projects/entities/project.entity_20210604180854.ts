import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinTable,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Project extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  body: string;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => User, (user: User) => user.projects)
  @JoinTable()
  user: User;
}
