import {Get, Post, Body, Put, Delete, Query, Param, Controller} from '@nestjs/common';
import { Request } from 'express';
import { ProjectService } from './project.service';
import { CreateProjectDto, CreateCommentDto } from './dto';
import { ProjectsRO, ProjectRO } from './project.interface';
import { CommentsRO } from './project.interface';
import { User } from '../user/user.decorator';

import {
  ApiBearerAuth,
  ApiResponse,
  ApiOperation, ApiTags,
} from '@nestjs/swagger';
import { PaginationDto } from './dto/pagination.dto';
import { PaginatedProductsResultDto } from './dto/paginate-result.dto';

@ApiBearerAuth()
@ApiTags('projects')
@Controller('projects')
export class ProjectController {

  constructor(private readonly projectService: ProjectService) {}

  @ApiOperation({ summary: 'Get all projects' })
  @ApiResponse({ status: 200, description: 'Return all projects.'})
  @Get('/all')
  async findAll(@Query() query): Promise<ProjectsRO> {
    return await this.projectService.findAll(query);
  }

  @Get()
  async findAllPaginate(@Query() paginationDto: PaginationDto): Promise<PaginatedProductsResultDto> {
    paginationDto.page = Number(paginationDto.page)
    paginationDto.limit = Number(paginationDto.limit)

    return this.projectService.findAllPagination({
      ...paginationDto,
      limit: paginationDto.limit > 10 ? 10 : paginationDto.limit
    })
  }


  @ApiOperation({ summary: 'Get project feed' })
  @ApiResponse({ status: 200, description: 'Return project feed.'})
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Get('feed')
  async getFeed(@User('id') userId: number, @Query() query): Promise<ProjectsRO> {
    return await this.projectService.findFeed(userId, query);
  }

  @Get(':slug')
  async findOne(@Param('slug') slug): Promise<ProjectRO> {
    return await this.projectService.findOne({slug});
  }

  @Get(':slug/comments')
  async findComments(@Param('slug') slug): Promise<CommentsRO> {
    return await this.projectService.findComments(slug);
  }

  @ApiOperation({ summary: 'Create project' })
  @ApiResponse({ status: 201, description: 'The project has been successfully created.'})
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Post()
  async create(@User('id') userId: number, @Body('project') projectData: CreateProjectDto) {
    return this.projectService.create(userId, projectData);
  }

  @ApiOperation({ summary: 'Update project' })
  @ApiResponse({ status: 201, description: 'The project has been successfully updated.'})
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Put(':slug')
  async update(@Param() params, @Body('project') projectData: CreateProjectDto) {
    // Todo: update slug also when title gets changed
    return this.projectService.update(params.slug, projectData);
  }

  @ApiOperation({ summary: 'Delete project' })
  @ApiResponse({ status: 201, description: 'The project has been successfully deleted.'})
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Delete(':slug')
  async delete(@Param() params) {
    return this.projectService.delete(params.slug);
  }

  @ApiOperation({ summary: 'Create comment' })
  @ApiResponse({ status: 201, description: 'The comment has been successfully created.'})
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Post(':slug/comments')
  async createComment(@Param('slug') slug, @Body('comment') commentData: CreateCommentDto) {
    return await this.projectService.addComment(slug, commentData);
  }

  @ApiOperation({ summary: 'Delete comment' })
  @ApiResponse({ status: 201, description: 'The project has been successfully deleted.'})
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Delete(':slug/comments/:id')
  async deleteComment(@Param() params) {
    const {slug, id} = params;
    return await this.projectService.deleteComment(slug, id);
  }

  @ApiOperation({ summary: 'Favorite project' })
  @ApiResponse({ status: 201, description: 'The project has been successfully favorited.'})
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Post(':slug/favorite')
  async favorite(@User('id') userId: number, @Param('slug') slug) {
    return await this.projectService.favorite(userId, slug);
  }

  @ApiOperation({ summary: 'Unfavorite project' })
  @ApiResponse({ status: 201, description: 'The project has been successfully unfavorited.'})
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Delete(':slug/favorite')
  async unFavorite(@User('id') userId: number, @Param('slug') slug) {
    return await this.projectService.unFavorite(userId, slug);
  }

}
