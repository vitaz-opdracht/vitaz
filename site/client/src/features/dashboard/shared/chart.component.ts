import {Component, Input, OnInit} from '@angular/core';
import 'chartjs-adapter-moment';

@Component({
    selector: 'vitaz-dashboard-chart',
    template: `
        <div>
            <p-card>
                <p-chart [type]="chartType" [data]="chartData" [options]="options"></p-chart>
            </p-card>
        </div>
    `
})
export class ChartComponent implements OnInit {
    @Input() chartType: 'line' | 'bar' | 'stacked-bar' = 'line';
    @Input({required: true}) chartData!: ChartData;
    @Input() timeUnit: 'day' | 'week' | 'month' = 'day';
    @Input() stacked: boolean = false;

    options: object = {};

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
                    type: 'timeseries',
                    time: {
                        unit: this.timeUnit,
                    },
                    ticks: {
                        source: 'auto',
                    },
                    stacked: this.stacked
                },
                y: {
                    beginAtZero: true,
                    stacked: this.stacked
                }

            }
        };
    }
}

export type ChartData = {
    datasets: {
        type?: string;
        label: string;
        data: { x: string; y: number; }[];
        backgroundColor?: string;
        borderColor?: string;
        tension?: number;
    }[];
};
