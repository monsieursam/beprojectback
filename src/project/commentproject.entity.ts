import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { ProjectEntity } from './project.entity';

@Entity()
export class CommentProject {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  body: string;

  @ManyToOne(type => ProjectEntity, project => project.comments)
  project: ProjectEntity;
}
