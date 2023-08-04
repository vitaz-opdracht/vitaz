import {NgModule} from '@angular/core';
import {CommonModule} from "@angular/common";
import {PrescriptionComponent} from "./prescription.component";
import {RouterModule} from "@angular/router";
import {TableModule} from "primeng/table";
import {InputTextModule} from "primeng/inputtext";
import {CalendarModule} from "primeng/calendar";
import {FormsModule} from "@angular/forms";
import {TriStateCheckboxModule} from "primeng/tristatecheckbox";
import {CardModule} from "primeng/card";
import {BadgeModule} from "primeng/badge";
import {RippleModule} from "primeng/ripple";

@NgModule({
  declarations: [PrescriptionComponent],
    imports: [
        CommonModule,
        RouterModule.forChild([
            {
                path: '',
                component: PrescriptionComponent
            }
        ]),
        TableModule,
        InputTextModule,
        CalendarModule,
        FormsModule,
        TriStateCheckboxModule,
        CardModule,
        BadgeModule,
        RippleModule,
    ],
  providers: [],
})
export class PrescriptionModule {
}
