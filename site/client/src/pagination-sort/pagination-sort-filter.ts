import {BehaviorSubject, combineLatest, switchMap} from "rxjs";
import {Pagination} from "./pagination";
import {Sort} from "./sort";
import {AbstractPaginationSortFilterService} from "./abstract-pagination-sort-filter.service";
import {Filter} from "./filter";

export class PaginationSortFilter<Entity, Service extends AbstractPaginationSortFilterService<Entity>> {
    readonly paginate$ = new BehaviorSubject<Pagination>({skip: 0, take: 10});
    readonly sort$ = new BehaviorSubject<Sort>({sortColumn: this.defaultSortColumn});
    readonly filter$ = new BehaviorSubject<Filter[]>([]);

    constructor(private service: Service, private defaultSortColumn: string) {

    }

    readonly result$ = combineLatest([this.paginate$, this.sort$, this.filter$])
        .pipe(
            switchMap(([pagination, sort, filters]) =>
                this.service.find(pagination, sort, filters)));

}
