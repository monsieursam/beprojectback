import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToMany, JoinTable } from 'typeorm';
import { UserEntity } from '../user/user.entity';

@Entity('tag')
export class TagEntity extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  tag: string;

  @ManyToMany(type => UserEntity, user => user.tags)
  @JoinTable()
  user: UserEntity[];

}
