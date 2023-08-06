import {Get, Query} from "@nestjs/common";
import {PaginatedService} from "./paginated-service";
import {PaginatedResource} from "./paginated-resource";
import {Between, Equal, FindOptionsOrder, Like, Raw} from "typeorm";
import {FindOptionsWhere} from "typeorm/find-options/FindOptionsWhere";

export abstract class PaginatedController<Entity, Service extends PaginatedService<Entity>> {
    protected constructor(protected readonly service: Service) {
    }

    @Get()
    async findAll(
        @Query() query: any,
    ): Promise<PaginatedResource<Entity>> {
        const {skip = 0, take = 10, sortColumn = 'id', sortOrder = 'ASC', ...extraParams} = query;

        const filters = this.parseFilters(extraParams);
        const order = this.parseOrder(sortColumn, sortOrder);

        return await this.service.findAllPaginated(skip, take, order, filters);
    }

    parseFilters(extraParams: object): FindOptionsWhere<Entity> {
        return Object.entries(extraParams).reduce((acc, [key, value]) => {
            value = JSON.parse(value as string);

            if (typeof value === 'string' || typeof value === 'number') {
                this.createFilter(acc, key, value);
            } else if (typeof value === 'object' && Array.isArray(value)) {
                if (value.length === 1) {
                    acc[key] = Equal(value[0]);
                } else if (value.length === 2) {
                    acc[key] = Between(value[0], value[1]);
                }
            }
            return acc;
        }, {});
    }

    parseOrder(sortColumn: string, sortOrder: string): FindOptionsOrder<Entity> {
        const columnParts = sortColumn.split('.');
        let root = null;
        columnParts.reduce((acc, curr, index) => {
            if (root === null) {
                root = acc;
            }

            if (index === columnParts.length - 1) {
                acc[curr] = sortOrder;
                return null;
            } else {
                const newObj = {};
                acc[curr] = newObj;
                return newObj;
            }
        }, {});

        return root;
    }

    createFilter(acc: object, key: string, value: string | number): void {
        if (typeof value === 'string') {
            value = value.toLowerCase();
        }

        const keyParts = key.split('.');
        keyParts.reduce((acc, curr, index) => {
            if (index === keyParts.length - 1) {
                acc[curr] = Raw((alias) =>`LOWER(${alias}) Like '%${value}%'`);
                return null;
            } else {
                const newObj = acc[curr] ?? {};
                acc[curr] = newObj;
                return newObj;
            }
        }, acc);
    }
}
