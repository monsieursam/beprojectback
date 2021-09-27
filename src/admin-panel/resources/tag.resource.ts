import { ResourceWithOptions } from 'admin-bro';
import { TagEntity } from '../../tag/tag.entity';

const UserResource: ResourceWithOptions = {
  resource: TagEntity,
  options: {},
};

export default UserResource;
