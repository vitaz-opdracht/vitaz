import {Component, Input} from '@angular/core';

@Component({
  selector: 'vitaz-dashboard-stats',
  template: `
      <p-card>
          <ng-template pTemplate="title">
              {{ title }}
          </ng-template>
          <ng-template pTemplate="content">
              <div class="flex gap-4" [ngClass]="{'flex-col': column}">
                  <div *ngFor="let item of items" class="w-40 px-5 h-28 py-7 rounded-md flex flex-col gap-2"
                       [ngClass]="getClassNames(item.color)">
                    <div class="flex justify-between items-center">
                      <i [classList]="item.icon" style="font-size: 1.5rem"></i>
                      <span>{{ item.extraContent }}</span>
                    </div>
                    <span>{{ item.content }}</span>
                  </div>
              </div>
          </ng-template>
      </p-card>
  `
})
export class StatsComponent {
  @Input({required: true}) title!: string;
  @Input({required: true}) items!: Stat[];
  @Input() column: boolean = false;

  getClassNames(color: string): string[] {
    return [`bg-${color}-100`, `text-${color}-500`];
  }
}

export interface Stat {
  color: string;
  icon: string;
  content: string;
  extraContent: string;
}
