import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { AdminLayoutComponent } from './layout/admin-layout/admin-layout.component';
import { PublicLayoutComponent } from './layout/public-layout/public-layout.component';
import { AppointmentsCalendarComponent } from './pages/appointments-calendar/appointments-calendar.component';
import { AppointmentsComponent } from './pages/appointments/appointments.component';
import { CatalogsComponent } from './pages/catalogs/catalogs.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { DoctorSchedulesComponent } from './pages/doctor-schedules/doctor-schedules.component';
import { DoctorsComponent } from './pages/doctors/doctors.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { MedicalRecordsComponent } from './pages/medical-records/medical-records.component';
import { OptionsComponent } from './pages/options/options.component';
import { PatientsComponent } from './pages/patients/patients.component';
import { RolesComponent } from './pages/roles/roles.component';
import { SpecialtiesComponent } from './pages/specialties/specialties.component';
import { UsersComponent } from './pages/users/users.component';

const routes: Routes = [
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      { path: '', component: HomeComponent }
    ]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: 'appointments',
        component: AppointmentsComponent
      },
      {
        path: 'appointments_calendar',
        component: AppointmentsCalendarComponent
      },
      {
        path: 'doctor_schedules',
        component: DoctorSchedulesComponent
      },
      {
        path: 'patients',
        component: PatientsComponent
      },
      {
        path: 'medical-records',
        component: MedicalRecordsComponent
      },
      {
        path: 'doctors',
        component: DoctorsComponent
      },
      {
        path: 'specialties',
        component: SpecialtiesComponent
      },
      {
        path: 'users',
        component: UsersComponent
      },
      {
        path: 'roles',
        component: RolesComponent
      },
      {
        path: 'catalogs',
        component: CatalogsComponent
      },
      {
        path: 'options',
        component: OptionsComponent
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }