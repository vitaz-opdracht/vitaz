import {NgModule} from '@angular/core';
import {CommonModule} from "@angular/common";
import {DashboardComponent} from "./dashboard.component";
import {RouterModule} from "@angular/router";
import {CardModule} from "primeng/card";
import {ChartModule} from "primeng/chart";
import {CalendarModule} from "primeng/calendar";
import {FormsModule} from "@angular/forms";

@NgModule({
  declarations: [DashboardComponent],
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
