import {NgModule} from '@angular/core';
import {CommonModule} from "@angular/common";
import {DoctorComponent} from "./doctor.component";
import {RouterModule} from "@angular/router";
import {CardModule} from "primeng/card";
import {TableModule} from "primeng/table";
import {FormsModule} from "@angular/forms";
import {InputTextModule} from "primeng/inputtext";

@NgModule({
  declarations: [DoctorComponent],
    imports: [
        CommonModule,
        RouterModule.forChild([
            {
                path: '',
                component: DoctorComponent
            }
        ]),
        CardModule,
        TableModule,
        FormsModule,
        InputTextModule,
    ],
  providers: [],
})
export class DoctorModule {
}
