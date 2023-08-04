import {NgModule} from '@angular/core';
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {CardModule} from "primeng/card";
import {TableModule} from "primeng/table";
import {FormsModule} from "@angular/forms";
import {InputTextModule} from "primeng/inputtext";
import {CalendarModule} from "primeng/calendar";
import {SettingsComponent} from "./settings.component";
import {OrderListModule} from "primeng/orderlist";
import {CheckboxModule} from "primeng/checkbox";

@NgModule({
    declarations: [SettingsComponent],
    imports: [
        CommonModule,
        RouterModule.forChild([
            {
                path: '',
                component: SettingsComponent
            }
        ]),
        CardModule,
        TableModule,
        FormsModule,
        InputTextModule,
        CalendarModule,
        OrderListModule,
        CheckboxModule,
    ],
    providers: [],
})
export class SettingsModule {
}
