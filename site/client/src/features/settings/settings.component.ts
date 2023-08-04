import {Component, OnInit} from '@angular/core';
import {SettingsService} from "./settings.service";
import {BehaviorSubject, delay, map} from 'rxjs';
import {Rule} from "./rule";
import {CheckboxChangeEvent} from "primeng/checkbox";

@Component({
    template: `
        <div class="flex flex-col items-center">
            <p-card *ngIf="(rules$ | async) as rules">
                <h1 class="mb-10">PRESCRIPTIONS</h1>
                <div class="flex flex-col gap-5">
                    <p-orderList [value]="rules" [dragdrop]="true" (onReorder)="reorder()">
                        <ng-template let-rule let-index pTemplate="item">
                            <div class="flex align-items-center p-2 w-full flex-wrap gap-5">
                                <div class="flex bg-blue-100 px-4 py-2 rounded-md text-blue-500 items-center">
                                    <span>#{{rule.ruleOrder}}</span>
                                </div>
                                <div class="flex-1">
                                    <h5 class="mb-2">{{ rule.id }}</h5>
                                    <span class="vertical-align-middle line-height-1">{{ rule.description }}</span>
                                </div>
                                <div class="flex items-center">
                                    <p-checkbox [ngModel]="rule.enabled === 1" [binary]="true"
                                                (onChange)="ruleCheckboxChange($event, rule)"></p-checkbox>
                                </div>
                            </div>
                        </ng-template>
                    </p-orderList>
                    <div class="flex justify-end">
                        <p-button label="Save" [loading]="loading" (onClick)="save()"></p-button>
                    </div>
                </div>
            </p-card>
        </div>
    `,
    styleUrls: ['settings.component.scss']
})
export class SettingsComponent implements OnInit {
    rules$ = new BehaviorSubject<Rule[]>([]);
    loading = false;

    constructor(private settingsService: SettingsService) {
    }

    ngOnInit() {
        this.settingsService
            .findAllRules()
            .pipe(map((rules) => rules.sort((r1, r2) => r1.ruleOrder - r2.ruleOrder)))
            .subscribe((rules) => {
                this.rules$.next(rules);
            });
    }

    reorder(): void {
        const rules = this.rules$.getValue();
        this.rules$.next(rules.map((rule, index) => ({...rule, ruleOrder: index})));
        console.log(this.rules$.getValue());
    }

    ruleCheckboxChange(event: CheckboxChangeEvent, rule: Rule): void {
        rule.enabled = event.checked ? 1 : 0;
    }

    save(): void {
        this.loading = true;
        this.settingsService.saveRules(this.rules$.getValue()).pipe(delay(250)).subscribe(() => {
            this.loading = false;
        });
    }
}
