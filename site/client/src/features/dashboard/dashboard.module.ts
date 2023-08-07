import {NgModule} from '@angular/core';
import {CommonModule} from "@angular/common";
import {DashboardComponent} from "./dashboard.component";
import {RouterModule} from "@angular/router";
import {CardModule} from "primeng/card";
import {ChartModule} from "primeng/chart";
import {CalendarModule} from "primeng/calendar";
import {FormsModule} from "@angular/forms";
import {PrescriptionLineChartComponent} from "./charts/prescription-line-chart.component";
import {PrescriptionBarChartComponent} from "./charts/prescription-bar-chart.component";
import {StatsComponent} from "./shared/stats.component";
import {DirectoryReaderStatsComponent} from "./stats/directory-reader-stats.component";
import {PrescriptionStatsComponent} from "./stats/prescription-stats.component";
import {ChartComponent} from "./shared/chart.component";
import {ViolationsStackedBarChartComponent} from "./charts/violations-stacked-bar-chart.component";

@NgModule({
    declarations: [DashboardComponent, StatsComponent, DirectoryReaderStatsComponent, PrescriptionStatsComponent, PrescriptionLineChartComponent, PrescriptionBarChartComponent, ViolationsStackedBarChartComponent, ChartComponent],
    imports: [
        CommonModule,
        RouterModule.forChild([
            {
                path: '',
                component: DashboardComponent
            }
        ]),
        CardModule,
        ChartModule,
        CalendarModule,
        FormsModule,
    ],
    providers: [],
})
export class DashboardModule {
}
