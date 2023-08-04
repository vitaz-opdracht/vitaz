import {NgModule} from '@angular/core';
import {CommonModule} from "@angular/common";
import {PatientComponent} from "./patient.component";
import {RouterModule} from "@angular/router";
import {CardModule} from "primeng/card";
import {TableModule} from "primeng/table";
import {FormsModule} from "@angular/forms";
import {InputTextModule} from "primeng/inputtext";
import {CalendarModule} from "primeng/calendar";

@NgModule({
  declarations: [PatientComponent],
    imports: [
        CommonModule,
        RouterModule.forChild([
            {
                path: '',
                component: PatientComponent
            }
        ]),
        CardModule,
        TableModule,
        FormsModule,
        InputTextModule,
        CalendarModule,
    ],
  providers: [],
})
export class PatientModule {
}
