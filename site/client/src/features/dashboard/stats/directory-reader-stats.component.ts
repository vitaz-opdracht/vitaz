import {Component} from '@angular/core';
import {map} from "rxjs";
import {DirReaderStatsService} from "../dir-reader-stats.service";
import {Stat} from "../shared/stats.component";

@Component({
    selector: 'vitaz-dashboard-directory-reader-stats',
    template: `<vitaz-dashboard-stats [title]="'Directory Reader Stats'" *ngIf="dirReaderStats$ | async as dirReaderStats" [items]="dirReaderStats"></vitaz-dashboard-stats>`
})
export class DirectoryReaderStatsComponent {
    dirReaderStats$ = this.dirReaderStatsService.findDirReaderStats().pipe(map((stats) => [
        {
            color: 'blue',
            content: `${stats.amountOfFilesAddedToFolder} total`,
            icon: 'pi pi-folder-open'
        } as Stat,
        {
            color: 'yellow',
            content: `${stats.amountOfFilesInFolder} processing`,
            icon: 'pi pi-clock'
        } as Stat,
        {
            color: 'green',
            content: `${stats.amountOfFilesProcessed} processed`,
            icon: 'pi pi-check'
        } as Stat
    ]));

    constructor(private dirReaderStatsService: DirReaderStatsService) {
    }
}
