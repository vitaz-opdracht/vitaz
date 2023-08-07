import {Component} from '@angular/core';
import {map, Observable} from "rxjs";
import {PrescriptionService} from "../../prescription/prescription.service";
import {Stat} from "../shared/stats.component";

@Component({
    selector: 'vitaz-dashboard-prescription-stats',
    template: `
        <vitaz-dashboard-stats [title]="'Prescription Stats'" *ngIf="counts$ | async as counts"
                               [items]="counts"></vitaz-dashboard-stats>`
})
export class PrescriptionStatsComponent {
    readonly counts$: Observable<Stat[]> =
        this.prescriptionService.findTotalCorrectRejectedCount().pipe(
            map(({total, correct, rejected}) => ({
                total,
                correct: {value: correct, percentage: correct / total * 100},
                rejected: {value: rejected, percentage: rejected / total * 100}
            })),
            map((counts) => [
                {
                    color: 'blue',
                    content: `${counts.total} processed`,
                    icon: 'pi pi-sync'
                } as Stat,
                {
                    color: 'green',
                    content: `${counts.correct.value} correct`,
                    extraContent: this.getPercentage(counts.correct.percentage),
                    icon: 'pi pi-check'
                } as Stat,
                {
                    color: 'red',
                    content: `${counts.rejected.value} rejected`,
                    extraContent: this.getPercentage(counts.rejected.percentage),
                    icon: 'pi pi-times'
                } as Stat
            ]));

    constructor(private prescriptionService: PrescriptionService) {
    }

    private getPercentage(value: number): string {
        return isNaN(value) ? '' : `${value.toFixed(2)}%`;
    }
}
