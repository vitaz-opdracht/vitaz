import {Component, ViewChild} from '@angular/core';
import {Table, TablePageEvent} from "primeng/table";
import {PaginationSortFilter} from '../../pagination-sort/pagination-sort-filter';
import {Filter} from 'src/pagination-sort/filter';
import {Patient} from "./patient";
import {PatientService} from "./patient.service";
import * as moment from "moment/moment";

@Component({
    template: `
        <p-card>
            <h1 class="mb-10">PATIENTS</h1>
            <ng-container *ngIf="(result$ | async) as paginatedPatients">
                <p-table #table
                         [value]="paginatedPatients.data"
                         [totalRecords]="paginatedPatients.totalRecords"
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
                            <th pSortableColumn="birthDate">Birthdate
                                <p-sortIcon field="birthDate"></p-sortIcon>
                            </th>
                            <th pSortableColumn="deathDate">Deathdate
                                <p-sortIcon field="deathDate"></p-sortIcon>
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
                            <span class="p-date-icon-left">
                                <i class="pi pi-search"></i>
                                <p-calendar selectionMode="range" [readonlyInput]="true" inputId="range"
                                            placeholder="Date range" dateFormat="yy.mm.dd"
                                            appendTo="body"
                                            [(ngModel)]="birthDateFilter"
                                            [showClear]="true"
                                            (onClear)="filter()"
                                            (onSelect)="filter()"></p-calendar>
                            </span>
                            </th>
                            <th>
                            <span class="p-date-icon-left">
                                <i class="pi pi-search"></i>
                                <p-calendar selectionMode="range" [readonlyInput]="true" inputId="range"
                                            placeholder="Date range" dateFormat="yy.mm.dd"
                                            appendTo="body"
                                            [(ngModel)]="deathDateFilter"
                                            [showClear]="true"
                                            (onClear)="filter()"
                                            (onSelect)="filter()"></p-calendar>
                            </span>
                            </th>
                        </tr>
                    </ng-template>
                    <ng-template pTemplate="body" let-patient>
                        <tr>
                            <td>{{ patient.firstName }}</td>
                            <td>{{ patient.lastName }}</td>
                            <td>{{ patient.birthDate }}</td>
                            <td>{{ patient.deathDate }}</td>
                        </tr>
                    </ng-template>
                </p-table>
            </ng-container>
        </p-card>
    `,
    styleUrls: ['patient.component.scss']
})
export class PatientComponent extends PaginationSortFilter<Patient, PatientService> {
    @ViewChild(Table) table!: Table;

    firstNameFilter = '';
    lastNameFilter = '';
    birthDateFilter: Date[] = [];
    deathDateFilter: Date[] = [];

    constructor(patientService: PatientService) {
        super(patientService, 'firstName');
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
        const birthDateFilterValue = this.birthDateFilter;
        const deathDateFilterValue = this.deathDateFilter;

        const filters: Filter[] = [];

        if (firstNameFilterValue !== '') {
            filters.push({field: 'firstName', value: firstNameFilterValue});
        }

        if (lastNameFilterValue !== '') {
            filters.push({field: 'lastName', value: lastNameFilterValue});
        }

        if (birthDateFilterValue !== null && birthDateFilterValue.length === 2) {
            filters.push({
                field: 'birthDate',
                value: birthDateFilterValue.filter(Boolean).map((date) => moment(date).format('YYYY-MM-DD'))
            });
        }

        if (deathDateFilterValue !== null && deathDateFilterValue.length === 2) {
            filters.push({
                field: 'deathDate',
                value: deathDateFilterValue.filter(Boolean).map((date) => moment(date).format('YYYY-MM-DD'))
            });
        }

        this.filter$.next(filters);
    }
}
