import { Project } from './entities/project.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
@EntityRepository(Project)
export class ProjectsRepository extends Repository<Project> {
    public async findAll(): Promise<Project[]> {
        return await this.find({});
    }

}