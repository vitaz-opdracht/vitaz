import {Component, OnInit} from '@angular/core';
import {BehaviorSubject, map, Observable, switchMap} from "rxjs";
import {PrescriptionService} from "../prescription/prescription.service";
import 'chartjs-adapter-moment';
import {PaginatedResource} from "../../pagination-sort/paginated-resource";
import {Prescription} from "../prescription/prescription";
import {Filter} from 'src/pagination-sort/filter';
import * as moment from "moment/moment";
import {DirReaderStatsService} from "./dir-reader-stats.service";

@Component({
  template: `
    <div class="flex flex-col items-center gap-5">
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

      <div class="flex gap-5">
        <p-card *ngIf="(counts$ | async) as counts">
          <ng-template pTemplate="title">
            Prescriptions
          </ng-template>
          <ng-template pTemplate="content">
            <div class="flex gap-4">
              <div class="bg-blue-100 w-40 px-5 h-28 py-7 rounded-md text-blue-500 flex flex-col gap-2">
                <i class="pi pi-sync" style="font-size: 1.5rem"></i>
                <span>{{ counts.total }} processed</span>
              </div>
              <div class="bg-green-100 w-40 px-5 h-28 py-7 rounded-md text-green-500 flex flex-col gap-2">
                <div class="flex justify-between items-center">
                  <i class="pi pi-check" style="font-size: 1.5rem"></i>
                  <span>{{ counts.correct.percentage | number:'1.0-2' }}%</span>
                </div>
                <span>{{ counts.correct.value }} correct</span>
              </div>
              <div class="bg-red-100 w-40 px-5 h-28 py-7 rounded-md text-red-500 flex flex-col gap-2">
                <div class="flex justify-between items-center">
                  <i class="pi pi-times" style="font-size: 1.5rem"></i>
                  <span>{{ counts.rejected.percentage | number:'1.0-2' }}%</span>
                </div>
                <span>{{ counts.rejected.value }} rejected</span>
              </div>
            </div>
          </ng-template>
        </p-card>

        <p-card *ngIf="(dirReaderStats$ | async) as dirReaderStats">
          <ng-template pTemplate="title">
            Prescriptions
          </ng-template>
          <ng-template pTemplate="content">
            <div class="flex gap-4">
              <div class="bg-blue-100 w-40 px-5 h-28 py-7 rounded-md text-blue-500 flex flex-col gap-2">
                <i class="pi pi-sync" style="font-size: 1.5rem"></i>
                <span>{{ dirReaderStats.amountOfFilesAddedToFolder }} total</span>
              </div>
              <div class="bg-green-100 w-40 px-5 h-28 py-7 rounded-md text-green-500 flex flex-col gap-2">
                <div class="flex justify-between items-center">
                  <i class="pi pi-check" style="font-size: 1.5rem"></i>
                </div>
                <span>{{ dirReaderStats.amountOfFilesInFolder }} in folder</span>
              </div>
              <div class="bg-red-100 w-40 px-5 h-28 py-7 rounded-md text-red-500 flex flex-col gap-2">
                <div class="flex justify-between items-center">
                  <i class="pi pi-times" style="font-size: 1.5rem"></i>
                </div>
                <span>{{ dirReaderStats.amountOfFilesProcessed }} processed</span>
              </div>
            </div>
          </ng-template>
        </p-card>
      </div>

      <div class="flex flex-row gap-5">
        <div class="flex">
          <p-card class="w-[500px]" *ngIf="(lineChartData$ | async) as data">
            <p-chart type="line" [data]="data" [options]="options"></p-chart>
          </p-card>
        </div>

        <div class="flex">
          <p-card class="w-[500px]" *ngIf="(barChartData$ | async) as data">
            <p-chart type="line" [data]="data" [options]="options"></p-chart>
          </p-card>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  dirReaderStats$ = this.dirReaderStatsService.findDirReaderStats();

  dateFilter$ = new BehaviorSubject<Filter[]>([]);

  readonly counts$: Observable<{
    total: number,
    correct: { value: number, percentage: number },
    rejected: { value: number, percentage: number }
  }> = this.prescriptionService.findTotalCorrectRejectedCount().pipe(map(({total, correct, rejected}) => ({
    total,
    correct: {value: correct, percentage: correct / total * 100},
    rejected: {value: rejected, percentage: rejected / total * 100}
  })));

  readonly data$: Observable<PaginatedResource<Prescription>> = this.dateFilter$.pipe(switchMap((filters) => {
    return this.prescriptionService.find({
      skip: 0,
      take: 10000
    }, {sortColumn: 'date', sortOrder: 'ASC'}, filters);
  }));

  readonly lineChartData$ = this.data$.pipe(map(({data}) => {
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
    };
  }));

  readonly barChartData$ = this.data$.pipe(map(({data}) => {
    const reductor = (acc: Map<string, number>, curr: string) => acc.set(curr, (acc.get(curr) ?? 0) + 1);

    const correct = data.filter(({valid}) => valid === 1).map(({date}) => date as unknown as string).reduce(reductor, new Map<string, number>);
    const rejected = data.filter(({valid}) => valid === 0).map(({date}) => date as unknown as string).reduce(reductor, new Map<string, number>);

    return {
      datasets: [
        {
          type: 'bar',
          label: 'Correct',
          data: [...correct.entries()].map(([key, value]) => ({x: key, y: value})),
          backgroundColor: 'rgb(34 197 94)',
        },
        {
          type: 'bar',
          label: 'Rejected',
          data: [...rejected.entries()].map(([key, value]) => ({x: key, y: value})),
          backgroundColor: 'rgb(239 68 68)',
        },
      ]
    };
  }));

  dateFilter: Date[] = [];

  options: any;

  constructor(private prescriptionService: PrescriptionService, private dirReaderStatsService: DirReaderStatsService) {
  }

  ngOnInit() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');

    this.options = {
      maintainAspectRatio: false,
      aspectRatio: 0.6,
      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        }
      },
      scales: {
        x: {
          type: 'time',
          time: {
            unit: 'day',
          },
          ticks: {
            source: 'auto',
          },
        },
        y: {
          beginAtZero: true
        }

      }
    };
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

    this.dateFilter$.next(filters);
  }
}
