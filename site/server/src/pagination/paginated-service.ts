import {Equal, FindManyOptions, FindOptionsOrder, Like, Repository} from "typeorm";
import {PaginatedResource} from "./paginated-resource";
import {FindOptionsWhere} from "typeorm/find-options/FindOptionsWhere";

export abstract class PaginatedService<Entity> {
    protected constructor(protected readonly repository: Repository<Entity>) {
    }

    async findAllPaginated(skip: number, take: number, order: FindOptionsOrder<Entity>, filters: FindOptionsWhere<Entity>): Promise<PaginatedResource<Entity>> {
        const options: FindManyOptions<Entity> = {skip, take};

        if (order != null) {
            options.order = order;
        }

        if (Object.keys(filters).length !== 0) {
            options.where = filters;
        }

        const [data, totalRecords] = await this.repository.findAndCount(options);

        return {data, totalRecords};
    }
}
