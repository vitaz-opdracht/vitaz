import {Component} from '@angular/core';
import 'chartjs-adapter-moment';
import {Filter} from 'src/pagination-sort/filter';
import * as moment from "moment/moment";
import {DateFilterService} from "./date-filter.service";

@Component({
  template: `
    <div class="flex flex-col items-center gap-5">
      <div class="flex gap-5">
        <vitaz-dashboard-prescription-stats class="w-1/2"></vitaz-dashboard-prescription-stats>
        <vitaz-dashboard-directory-reader-stats class="w-1/2"></vitaz-dashboard-directory-reader-stats>
      </div>
      
      <div class="flex gap-5 justify-items-stretch">
        <p-card>
          <ng-template pTemplate="title">
            Filters
          </ng-template>
          <ng-template pTemplate="content">
            <p-calendar selectionMode="range" [readonlyInput]="true" inputId="range"
                        placeholder="Date range" dateFormat="yy.mm.dd"
                        appendTo="body"
                        [(ngModel)]="dateFilter"
                        [showClear]="true"
                        (onClear)="filter()"
                        (onSelect)="filter()"
            ></p-calendar>
          </ng-template>
        </p-card>
      </div>

      <div class="flex gap-5 w-full justify-center">
        <vitaz-dashboard-violations-stacked-bar-chart class="w-1/2"></vitaz-dashboard-violations-stacked-bar-chart>
        <vitaz-dashboard-prescription-bar-chart class="w-1/2"></vitaz-dashboard-prescription-bar-chart>
      </div>

      <vitaz-dashboard-prescription-line-chart class="w-full"></vitaz-dashboard-prescription-line-chart>
    </div>
  `
})
export class DashboardComponent {
  dateFilter: Date[] = [];

  constructor(private dateFilterService: DateFilterService) {
    this.dateFilterService.next([]);
  }

  filter(): void {
    const dateFilterValue = this.dateFilter;

    const filters: Filter[] = [];

    if (dateFilterValue !== null && dateFilterValue.length === 2) {
      filters.push({
        field: 'date',
        value: dateFilterValue.filter(Boolean).map((date) => moment(date).format('YYYY-MM-DD'))
      });
    }

    this.dateFilterService.next(filters);
  }
}
