import {Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs";
import {Filter} from "../../pagination-sort/filter";

@Injectable({providedIn: 'root',})
export class DateFilterService {
    private dateFilterSubject$ = new BehaviorSubject<Filter[]>([]);
    public dateFilter$ = this.dateFilterSubject$.asObservable();

    next(filters: Filter[]): void {
        this.dateFilterSubject$.next(filters);
    }
}
