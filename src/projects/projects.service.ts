import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

import { Project } from './entities/project.entity';
import { ProjectsRepository } from './projects.repository';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(ProjectsRepository)
    private projectsRepository: ProjectsRepository,
  ) {}

  async create(createProjectDto: CreateProjectDto) {
    const project = Project.create(Project);
    await project.save();

    return project;
  }

  async findAll() {
    return this.projectsRepository.findAll();
  }

  findOne(id: number) {
    return `This action returns a #${id} project`;
  }

  update(id: number, updateProjectDto: UpdateProjectDto) {
    return `This action updates a #${id} project`;
  }

  remove(id: number) {
    return `This action removes a #${id} project`;
  }
}
