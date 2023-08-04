import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [
    {
        path: 'prescriptions',
        loadChildren: () => import('../features/prescription/prescription.module').then((x) => x.PrescriptionModule)
    },
    {
        path: 'doctors',
        loadChildren: () => import('../features/doctor/doctor.module').then((m) => m.DoctorModule)
    },
    {
        path: 'patients',
        loadChildren: () => import('../features/patient/patient.module').then((m) => m.PatientModule)
    },
    {
        path: 'dashboard',
        loadChildren: () => import('../features/dashboard/dashboard.module').then((m) => m.DashboardModule)
    },
    {
        path: 'settings',
        loadChildren: () => import('../features/settings/settings.module').then((m) => m.SettingsModule)
    }
];


@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
