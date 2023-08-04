import {Component, ViewChild} from '@angular/core';
import {PrescriptionService} from "./prescription.service";
import {Table, TablePageEvent} from "primeng/table";
import {PaginationSortFilter} from '../../pagination-sort/pagination-sort-filter';
import {Prescription} from './prescription';
import {Filter} from 'src/pagination-sort/filter';
import * as moment from 'moment';
import {map} from 'rxjs';

@Component({
    template: `
        <p-card>
            <h1 class="mb-10">PRESCRIPTIONS</h1>
            <ng-container *ngIf="(data$ | async) as paginatedPrescriptions">
                <p-table #table
                         dataKey="id"
                         [value]="paginatedPrescriptions.data"
                         [totalRecords]="paginatedPrescriptions.totalRecords"
                         [lazy]="true"
                         [paginator]="true"
                         [rows]="10"
                         [rowsPerPageOptions]="[10, 25, 50]"
                         (onPage)="onPage($event)"
                         (onSort)="onSort($event)">
                    <ng-template pTemplate="header">
                        <tr>
                            <th style="width: 5rem"></th>
                            <th pSortableColumn="doctor.firstName">Doctor
                                <p-sortIcon field="doctor.firstName"></p-sortIcon>
                            </th>
                            <th pSortableColumn="patient.firstName">Patient
                                <p-sortIcon field="patient.firstName"></p-sortIcon>
                            </th>
                            <th pSortableColumn="date">Date
                                <p-sortIcon field="date"></p-sortIcon>
                            </th>
                            <th pSortableColumn="valid">Valid
                                <p-sortIcon field="valid"></p-sortIcon>
                            </th>
                        </tr>
                        <tr>
                            <th style="width: 5rem"></th>
                            <th>
                            <span class="p-input-icon-left">
                                <i class="pi pi-search"></i>
                                <input pInputText type="text" (input)="filter()" [(ngModel)]="doctorFilter"
                                       placeholder="Search doctor"/>
                            </span>
                            </th>
                            <th>
                            <span class="p-input-icon-left">
                                <i class="pi pi-search"></i>
                                <input pInputText type="text" (input)="filter()" [(ngModel)]="patientFilter"
                                       placeholder="Search patient"/>
                            </span>
                            </th>
                            <th>
                            <span class="p-date-icon-left">
                                <i class="pi pi-search"></i>
                                <p-calendar selectionMode="range" [readonlyInput]="true" inputId="range"
                                            placeholder="Date range" dateFormat="yy.mm.dd"
                                            appendTo="body"
                                            [(ngModel)]="dateFilter"
                                            [showClear]="true"
                                            (onClear)="filter()"
                                            (onSelect)="filter()"></p-calendar>
                            </span>
                            </th>
                            <th>
                                <p-triStateCheckbox [(ngModel)]="validFilter"
                                                    (onChange)="filter()"></p-triStateCheckbox>
                            </th>
                        </tr>
                    </ng-template>
                    <ng-template pTemplate="body" let-prescription let-expanded="expanded">
                        <tr>
                            <td>
                                <button *ngIf="!prescription.valid" type="button" pButton pRipple
                                        [pRowToggler]="prescription"
                                        class="p-button-text p-button-rounded p-button-plain"
                                        [icon]="expanded ? 'pi pi-chevron-down' : 'pi pi-chevron-right'"></button>
                            </td>
                            <td>{{ prescription.doctor.firstName + ' ' + prescription.doctor.lastName }}</td>
                            <td>{{ prescription.patient.firstName + ' ' + prescription.patient.lastName }}</td>
                            <td>{{ prescription.date }}</td>
                            <td>
                                <div class="flex items-center gap-2">
                                    <i class="pi h-full" style="font-size: 1.5rem"
                                       [ngClass]="{ 'text-green-500 pi-check-circle': prescription.valid, 'text-red-500 pi-times-circle': !prescription.valid }"></i>
                                    <p-badge *ngIf="!prescription.valid" [value]="prescription.ruleViolations.length"
                                             severity="danger"></p-badge>
                                </div>
                            </td>
                        </tr>
                    </ng-template>
                    <ng-template pTemplate="rowexpansion" let-prescription>
                        <tr>
                            <td colspan="5">
                                <div class="p-3">
                                    <div *ngFor="let violation of prescription.ruleViolations"
                                         class="flex items-center gap-2 pl-24">
                                        <i class="pi pi-times-circle text-red-500"></i>
                                        <span>{{violation.rule.description}}</span>
                                        <i *ngIf="!violation.rule.enabled" class="pi pi-exclamation-circle text-yellow-600"></i>
                                        <span *ngIf="!violation.rule.enabled" class="text-yellow-600">rule currently disabled</span>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </ng-template>
                </p-table>
            </ng-container>
        </p-card>
    `,
    styleUrls: ['prescription.component.scss']
})
export class PrescriptionComponent extends PaginationSortFilter<Prescription, PrescriptionService> {
    @ViewChild(Table) table!: Table;

    readonly data$ = this.result$.pipe(map((result) => ({
        ...result,
        data: result.data.map((prescription) => ({
            ...prescription,
            ruleViolations: prescription.ruleViolations.sort((v1, v2) => v1.rule.ruleOrder - v2.rule.ruleOrder)
        }))
    })));

    idFilter = '';
    dateFilter: Date[] = [];
    validFilter: boolean | null = null;
    doctorFilter = '';
    patientFilter = '';

    constructor(prescriptionService: PrescriptionService) {
        super(prescriptionService, 'id');
    }

    onPage(event: TablePageEvent): void {
        this.paginate$.next({skip: event.first, take: event.rows});
    }

    onSort(event: { field: string, order: number }): void {
        this.sort$.next({sortColumn: event.field, sortOrder: event.order === 1 ? 'ASC' : 'DESC'});
    }

    filter(): void {
        const idFilterValue = this.idFilter;
        const doctorFilterValue = this.doctorFilter;
        const patientFilterValue = this.patientFilter;
        const dateFilterValue = this.dateFilter;
        const validFilterValue = this.validFilter;

        const filters: Filter[] = [];

        if (idFilterValue !== '') {
            filters.push({field: 'id', value: idFilterValue});
        }

        if (doctorFilterValue !== '') {
            filters.push({field: 'doctor.firstName', value: doctorFilterValue});
        }

        if (patientFilterValue !== '') {
            filters.push({field: 'patient.firstName', value: patientFilterValue});
        }

        if (dateFilterValue !== null && dateFilterValue.length === 2) {
            filters.push({
                field: 'date',
                value: dateFilterValue.filter(Boolean).map((date) => moment(date).format('YYYY-MM-DD'))
            });
        }

        if (validFilterValue !== null) {
            filters.push({field: 'valid', value: validFilterValue ? 1 : 0});
        }

        this.filter$.next(filters);
    }
}
