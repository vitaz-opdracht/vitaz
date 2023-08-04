import {Component} from '@angular/core';
import {MenuItem} from "primeng/api";

@Component({
  selector: 'app-root',
  template: `
      <div class="min-h-full min-w-full">
          <div class="mx-auto h-full flex items-center flex-col">
              <div class="w-full flex justify-center bg-white grow">
                  <p-tabMenu [model]="items"></p-tabMenu>
              </div>
              <div class="mt-10 w-10/12">
                  <router-outlet></router-outlet>
              </div>
          </div>
      </div>
  `,
})
export class AppComponent {
  items: MenuItem[] | undefined;

  ngOnInit() {
    this.items = [
      {label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: 'dashboard'},
      {label: 'Prescriptions', icon: 'pi pi-fw pi-home', routerLink: 'prescriptions'},
      {label: 'Doctors', icon: 'pi pi-fw pi-calendar', routerLink: 'doctors'},
      {label: 'Patients', icon: 'pi pi-fw pi-pencil', routerLink: 'patients'},
      {label: 'Settings', icon: 'pi pi-fw pi-pencil', routerLink: 'settings'}
    ];
  }
}
