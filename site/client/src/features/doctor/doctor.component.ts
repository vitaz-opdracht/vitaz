import {Component, ViewChild} from '@angular/core';
import {Table, TablePageEvent} from "primeng/table";
import {PaginationSortFilter} from '../../pagination-sort/pagination-sort-filter';
import {Filter} from 'src/pagination-sort/filter';
import {Doctor} from "./doctor";
import {DoctorService} from "./doctor.service";

@Component({
    template: `
        <p-card>
            <h1 class="mb-10">DOCTORS</h1>
            <ng-container *ngIf="(result$ | async) as paginatedDoctors">
                <p-table #table
                         [value]="paginatedDoctors.data"
                         [totalRecords]="paginatedDoctors.totalRecords"
                         [lazy]="true"
                         [paginator]="true"
                         [rows]="10"
                         [rowsPerPageOptions]="[10, 25, 50]"
                         (onPage)="onPage($event)"
                         (onSort)="onSort($event)">
                    <ng-template pTemplate="header">
                        <tr>
                            <th pSortableColumn="firstName">Firstname
                                <p-sortIcon field="firstName"></p-sortIcon>
                            </th>
                            <th pSortableColumn="lastName">Lastname
                                <p-sortIcon field="lastName"></p-sortIcon>
                            </th>
                            <th pSortableColumn="specialty.name">Specialty
                                <p-sortIcon field="specialty.name"></p-sortIcon>
                            </th>
                        </tr>
                        <tr>
                            <th>
                                <span class="p-input-icon-left">
                                    <i class="pi pi-search"></i>
                                    <input pInputText type="text" (input)="filter()" [(ngModel)]="firstNameFilter"
                                           placeholder="Search"/>
                                </span>
                            </th>
                            <th>
                                <span class="p-input-icon-left">
                                    <i class="pi pi-search"></i>
                                    <input pInputText type="text" (input)="filter()" [(ngModel)]="lastNameFilter"
                                           placeholder="Search"/>
                                </span>
                            </th>
                            <th>
                                <span class="p-input-icon-left">
                                    <i class="pi pi-search"></i>
                                    <input pInputText type="text" (input)="filter()" [(ngModel)]="specialtyNameFilter"
                                           placeholder="Search"/>
                                </span>
                            </th>
                        </tr>
                    </ng-template>
                    <ng-template pTemplate="body" let-doctor>
                        <tr>
                            <td>{{ doctor.firstName }}</td>
                            <td>{{ doctor.lastName }}</td>
                            <td>{{ doctor.specialty.name }}</td>
                        </tr>
                    </ng-template>
                </p-table>
            </ng-container>
        </p-card>
    `,
})
export class DoctorComponent extends PaginationSortFilter<Doctor, DoctorService> {
    @ViewChild(Table) table!: Table;

    firstNameFilter = '';
    lastNameFilter = '';
    specialtyNameFilter = '';

    constructor(doctorService: DoctorService) {
        super(doctorService, 'firstName');
    }

    onPage(event: TablePageEvent): void {
        this.paginate$.next({skip: event.first, take: event.rows});
    }

    onSort(event: { field: string, order: number }): void {
        this.sort$.next({sortColumn: event.field, sortOrder: event.order === 1 ? 'ASC' : 'DESC'});
    }

    filter(): void {
        const firstNameFilterValue = this.firstNameFilter;
        const lastNameFilterValue = this.lastNameFilter;
        const specialtyNameFilterValue = this.specialtyNameFilter;

        const filters: Filter[] = [];

        if (firstNameFilterValue !== '') {
            filters.push({field: 'firstName', value: firstNameFilterValue});
        }

        if (lastNameFilterValue !== '') {
            filters.push({field: 'lastName', value: lastNameFilterValue});
        }

        if (specialtyNameFilterValue !== '') {
            filters.push({field: 'specialty.name', value: specialtyNameFilterValue});
        }

        this.filter$.next(filters);
    }
}
