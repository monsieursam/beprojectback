import { ResourceWithOptions } from 'admin-bro';
import { ProjectEntity } from '../../project/project.entity';

const UserResource: ResourceWithOptions = {
  resource: ProjectEntity,
  options: {},
};

export default UserResource;
