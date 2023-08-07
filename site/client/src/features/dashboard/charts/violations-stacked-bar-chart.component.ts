import {Component} from '@angular/core';
import {map, Observable, switchMap} from "rxjs";
import {PrescriptionService} from "../../prescription/prescription.service";
import {DateFilterService} from "../date-filter.service";
import {PaginatedResource} from "../../../pagination-sort/paginated-resource";
import {Prescription} from "../../prescription/prescription";
import {ChartData} from "../shared/chart.component";
import 'chartjs-adapter-moment';
import * as moment from "moment";
import {PrescriptionRuleViolation} from "../../prescription-rule-violation/prescription-rule-violation";

@Component({
    selector: 'vitaz-dashboard-violations-stacked-bar-chart',
    template: `
        <vitaz-dashboard-chart *ngIf="chartData$ | async as chartData" [chartType]="'bar'" [stacked]="true"
                               [timeUnit]="'month'"
                               [chartData]="chartData"></vitaz-dashboard-chart>
    `
})
export class ViolationsStackedBarChartComponent {
    readonly data$: Observable<PaginatedResource<Prescription>> = this.dateFilterService.dateFilter$.pipe(switchMap((filters) => {
        return this.prescriptionService.find({
            skip: 0,
            take: 10000
        }, {sortColumn: 'date', sortOrder: 'ASC'}, filters);
    }));

    readonly chartData$ = this.data$.pipe(map(({data}) => {
        const rejectedRecords = data
            .filter(({valid}) => valid === 0)
            .map(({date, ruleViolations}) => ({date, ruleViolations}));

        const partitions = this.partitionByMonth(rejectedRecords);

        return {
            datasets: Object.entries(partitions).map(([label, data]) => ({
                type: 'bar',
                label,
                data: Object.entries(data).map(([date, value]) => ({x: date, y: value}))
            }))
        } as ChartData;
    }));

    constructor(private prescriptionService: PrescriptionService, private dateFilterService: DateFilterService) {
    }

    private partitionByMonth(records: { date: Date, ruleViolations: PrescriptionRuleViolation[] }[]) {
        return records.reduce((acc, curr) => {
            for (const ruleViolation of curr.ruleViolations) {
                if (acc[ruleViolation.ruleId] === undefined) {
                    acc[ruleViolation.ruleId] = {};
                }
                const mont = moment(curr.date);
                const month = mont.format('YYYY-MM');
                if (acc[ruleViolation.ruleId][month] === undefined) {
                    acc[ruleViolation.ruleId][month] = 0;
                }
                acc[ruleViolation.ruleId][month] += 1;
            }
            return acc;
        }, {} as { [key: string]: { [key: string]: number } });
    }
}
