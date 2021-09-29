import { ProjectEntity } from "../project.entity";

export class PaginatedProductsResultDto {
  data: ProjectEntity[]
  page: number
  limit: number
  totalCount: number
}
