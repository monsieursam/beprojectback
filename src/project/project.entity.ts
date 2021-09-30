import { Entity, PrimaryGeneratedColumn, Column, OneToOne, ManyToOne, OneToMany, JoinColumn, AfterUpdate, BeforeUpdate, BaseEntity, ManyToMany, JoinTable } from 'typeorm';
import { TagEntity } from '../tag/tag.entity';
import { UserEntity } from '../user/user.entity';
import { CommentProject } from './commentproject.entity';

@Entity('project')
export class ProjectEntity extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  slug: string;

  @Column()
  title: string;

  @Column({default: ''})
  description: string;

  @Column({default: ''})
  body: string;

  @Column({ type: 'timestamp', default: () => "CURRENT_TIMESTAMP"})
  created: Date;

  @Column({ type: 'timestamp', default: () => "CURRENT_TIMESTAMP"})
  updated: Date;

  @BeforeUpdate()
  updateTimestamp() {
    this.updated = new Date;
  }

  @Column('simple-array')
  tagList: string[];

  @ManyToMany(type => TagEntity, tag => tag.projects)
  @JoinColumn()
  tags: TagEntity[];

  @ManyToOne(type => UserEntity, user => user.projects)
  author: UserEntity;

  @OneToMany(type => CommentProject, commentproject => commentproject.project, {eager: true})
  @JoinColumn()
  comments: CommentProject[];

  @Column({default: 0})
  favoriteCount: number;
}
