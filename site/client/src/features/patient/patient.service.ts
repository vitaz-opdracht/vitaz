import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {AbstractPaginationSortFilterService} from "../../pagination-sort/abstract-pagination-sort-filter.service";
import {Patient} from "./patient";

@Injectable({providedIn: 'root',})
export class PatientService extends AbstractPaginationSortFilterService<Patient> {
    constructor(protected override readonly httpClient: HttpClient) {
        super(httpClient, 'patient');
    }
}
