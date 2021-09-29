import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getRepository, DeleteResult } from 'typeorm';
import { ProjectEntity } from './project.entity';
import { CommentProject } from './commentproject.entity';
import { UserEntity } from '../user/user.entity';
import { FollowsEntity } from '../profile/follows.entity';
import { CreateProjectDto } from './dto';

import {ProjectRO, ProjectsRO, CommentsRO} from './project.interface';
import { PaginationDto } from './dto/pagination.dto';
import { PaginatedProductsResultDto } from './dto/paginate-result.dto';
const slug = require('slug');

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(ProjectEntity)
    private readonly projectRepository: Repository<ProjectEntity>,
    @InjectRepository(CommentProject)
    private readonly commentRepository: Repository<CommentProject>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(FollowsEntity)
    private readonly followsRepository: Repository<FollowsEntity>
  ) {}

  async findAll(query): Promise<ProjectsRO> {

    const qb = await getRepository(ProjectEntity)
      .createQueryBuilder('project')
      .leftJoinAndSelect('project.author', 'author');

    qb.where("1 = 1");

    if ('tag' in query) {
      qb.andWhere("project.tagList LIKE :tag", { tag: `%${query.tag}%` });
    }

    if ('author' in query) {
      const author = await this.userRepository.findOne({username: query.author});
      qb.andWhere("project.authorId = :id", { id: author.id });
    }

    if ('favorited' in query) {
      const author = await this.userRepository.findOne({username: query.favorited});
      const ids = author.favorites.map(el => el.id);
      qb.andWhere("project.authorId IN (:ids)", { ids });
    }

    qb.orderBy('project.created', 'DESC');

    const projectsCount = await qb.getCount();

    if ('limit' in query) {
      qb.limit(query.limit);
    }

    if ('offset' in query) {
      qb.offset(query.offset);
    }

    const projects = await qb.getMany();

    return {projects, projectsCount};
  }

  async findAllPagination(paginationDto: PaginationDto): Promise<PaginatedProductsResultDto> {
    const skippedItems = (paginationDto.page - 1) * paginationDto.limit;

    const totalCount = await this.projectRepository.count()
    const products = await this.projectRepository.createQueryBuilder()
      .orderBy('createdAt', "DESC")
      .offset(skippedItems)
      .limit(paginationDto.limit)
      .getMany()

    return {
      totalCount,
      page: paginationDto.page,
      limit: paginationDto.limit,
      data: products,
    }
  }

  async findFeed(userId: number, query): Promise<ProjectsRO> {
    const _follows = await this.followsRepository.find( {followerId: userId});

    if (!(Array.isArray(_follows) && _follows.length > 0)) {
      return {projects: [], projectsCount: 0};
    }

    const ids = _follows.map(el => el.followingId);

    const qb = await getRepository(ProjectEntity)
      .createQueryBuilder('project')
      .where('project.authorId IN (:ids)', { ids });

    qb.orderBy('project.created', 'DESC');

    const projectsCount = await qb.getCount();

    if ('limit' in query) {
      qb.limit(query.limit);
    }

    if ('offset' in query) {
      qb.offset(query.offset);
    }

    const projects = await qb.getMany();

    return {projects, projectsCount};
  }

  async findOne(where): Promise<ProjectRO> {
    const project = await this.projectRepository.findOne(where);
    return {project};
  }

  async addComment(slug: string, commentData): Promise<ProjectRO> {
    let project = await this.projectRepository.findOne({slug});

    const comment = new CommentProject();
    comment.body = commentData.body;

    project.comments.push(comment);

    await this.commentRepository.save(comment);
    project = await this.projectRepository.save(project);
    return {project}
  }

  async deleteComment(slug: string, id: string): Promise<ProjectRO> {
    let project = await this.projectRepository.findOne({slug});

    const comment = await this.commentRepository.findOne(id);
    const deleteIndex = project.comments.findIndex(_comment => _comment.id === comment.id);

    if (deleteIndex >= 0) {
      const deleteComments = project.comments.splice(deleteIndex, 1);
      await this.commentRepository.delete(deleteComments[0].id);
      project =  await this.projectRepository.save(project);
      return {project};
    } else {
      return {project};
    }

  }

  async favorite(id: number, slug: string): Promise<ProjectRO> {
    let project = await this.projectRepository.findOne({slug});
    const user = await this.userRepository.findOne(id);

    const isNewFavorite = user.favorites.findIndex(_project => _project.id === project.id) < 0;
    if (isNewFavorite) {
      user.favorites.push(project);
      project.favoriteCount++;

      await this.userRepository.save(user);
      project = await this.projectRepository.save(project);
    }

    return {project};
  }

  async unFavorite(id: number, slug: string): Promise<ProjectRO> {
    let project = await this.projectRepository.findOne({slug});
    const user = await this.userRepository.findOne(id);

    const deleteIndex = user.favorites.findIndex(_project => _project.id === project.id);

    if (deleteIndex >= 0) {

      user.favorites.splice(deleteIndex, 1);
      project.favoriteCount--;

      await this.userRepository.save(user);
      project = await this.projectRepository.save(project);
    }

    return {project};
  }

  async findComments(slug: string): Promise<CommentsRO> {
    const project = await this.projectRepository.findOne({slug});
    return {comments: project.comments};
  }

  async create(userId: number, projectData: CreateProjectDto): Promise<ProjectEntity> {

    let project = new ProjectEntity();
    project.title = projectData.title;
    project.description = projectData.description;
    project.slug = this.slugify(projectData.title);
    project.tagList = projectData.tagList || [];
    project.comments = [];

    const newProject = await this.projectRepository.save(project);

    const author = await this.userRepository.findOne({ where: { id: userId }, relations: ['projects'] });
    author.projects.push(project);

    await this.userRepository.save(author);

    return newProject;

  }

  async update(slug: string, projectData: any): Promise<ProjectRO> {
    let toUpdate = await this.projectRepository.findOne({ slug: slug});
    let updated = Object.assign(toUpdate, projectData);
    const project = await this.projectRepository.save(updated);
    return {project};
  }

  async delete(slug: string): Promise<DeleteResult> {
    return await this.projectRepository.delete({ slug: slug});
  }

  slugify(title: string) {
    return slug(title, {lower: true}) + '-' + (Math.random() * Math.pow(36, 6) | 0).toString(36)
  }
}
