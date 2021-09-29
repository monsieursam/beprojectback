import {Entity, PrimaryGeneratedColumn, Column, BeforeInsert, JoinTable, ManyToMany, OneToMany, BaseEntity} from 'typeorm';
import { IsEmail } from 'class-validator';
import { Exclude } from 'class-transformer';
import * as argon2 from 'argon2';
import { ArticleEntity } from '../article/article.entity';
import { ProjectEntity } from '../project/project.entity';

@Entity('user')
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column({select: false})
  @IsEmail()
  email: string;

  @Column({default: ''})
  bio: string;

  @Column({default: ''})
  image: string;

  @Column({select: false})
  password: string;

  @Column('simple-array', {nullable: true})
  tagList: string[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await argon2.hash(this.password);
  }

  @ManyToMany(type => ArticleEntity)
  @JoinTable()
  favorites: ProjectEntity[];

  @OneToMany(type => ArticleEntity, article => article.author)
  articles: ArticleEntity[];

  @OneToMany(type => ProjectEntity, project => project.author)
  projects: ProjectEntity[];

}
