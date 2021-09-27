import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

@Entity('tag')
export class TagEntity extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  tag: string;

}
