import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {PaginatedResource} from "./paginated-resource";
import {Filter} from "./filter";
import {Pagination} from "./pagination";
import {Sort} from "./sort";

export class AbstractPaginationSortFilterService<Entity> {
    constructor(protected readonly httpClient: HttpClient, private readonly entityName: string) {
    }

    find(pagination: Pagination, sort: Sort, filters: Filter[]): Observable<PaginatedResource<Entity>> {
        let params = new HttpParams()
            .set('skip', pagination.skip)
            .set('take', pagination.take)
            .set('sortColumn', sort.sortColumn)
            .set('sortOrder', sort.sortOrder || 'ASC');

        for (const filter of filters) {
            params = params.set(filter.field, JSON.stringify(filter.value));
        }

        return this.httpClient.get<PaginatedResource<Entity>>(`http://localhost:3000/${this.entityName}`, {params});
    }
}
