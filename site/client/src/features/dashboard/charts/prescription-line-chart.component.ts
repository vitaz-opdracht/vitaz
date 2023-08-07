import {Component} from '@angular/core';
import {map, Observable, switchMap} from "rxjs";
import {PrescriptionService} from "../../prescription/prescription.service";
import {PaginatedResource} from "../../../pagination-sort/paginated-resource";
import {Prescription} from "../../prescription/prescription";
import {DateFilterService} from "../date-filter.service";
import {ChartData} from "../shared/chart.component";

@Component({
    selector: 'vitaz-dashboard-prescription-line-chart',
    template: `<vitaz-dashboard-chart *ngIf="chartData$ | async as chartData" [chartType]="'line'" [chartData]="chartData"></vitaz-dashboard-chart>`
})
export class PrescriptionLineChartComponent {
    readonly data$: Observable<PaginatedResource<Prescription>> = this.dateFilterService.dateFilter$.pipe(switchMap((filters) => {
        return this.prescriptionService.find({
            skip: 0,
            take: 10000
        }, {sortColumn: 'date', sortOrder: 'ASC'}, filters);
    }));

    readonly chartData$ = this.data$.pipe(map(({data}) => {
        const reductor = (acc: Map<string, number>, curr: string) => acc.set(curr, (acc.get(curr) ?? 0) + 1);

        const processed = data.map(({date}) => date as unknown as string).reduce(reductor, new Map<string, number>);
        const correct = data.filter(({valid}) => valid === 1).map(({date}) => date as unknown as string).reduce(reductor, new Map<string, number>);
        const rejected = data.filter(({valid}) => valid === 0).map(({date}) => date as unknown as string).reduce(reductor, new Map<string, number>);

        return {
            datasets: [
                {
                    label: 'Processed',
                    data: [...processed.entries()].map(([key, value]) => ({x: key, y: value})),
                    borderColor: 'rgb(59 130 246)',
                    tension: 0.4
                },
                {
                    label: 'Correct',
                    data: [...correct.entries()].map(([key, value]) => ({x: key, y: value})),
                    borderColor: 'rgb(34 197 94)',
                    tension: 0.4
                },
                {
                    label: 'Rejected',
                    data: [...rejected.entries()].map(([key, value]) => ({x: key, y: value})),
                    borderColor: 'rgb(239 68 68)',
                    tension: 0.4
                },
            ]
        } as ChartData;
    }));

    constructor(private prescriptionService: PrescriptionService, private dateFilterService: DateFilterService) {
    }
}
