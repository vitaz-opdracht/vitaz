import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {AbstractPaginationSortFilterService} from "../../pagination-sort/abstract-pagination-sort-filter.service";
import {Doctor} from "./doctor";

@Injectable({providedIn: 'root',})
export class DoctorService extends AbstractPaginationSortFilterService<Doctor> {
    constructor(protected override readonly httpClient: HttpClient) {
        super(httpClient, 'doctor');
    }
}
