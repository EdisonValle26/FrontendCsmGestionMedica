import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminLayoutComponent } from './layout/admin-layout/admin-layout.component';
import { PublicLayoutComponent } from './layout/public-layout/public-layout.component';
import { AppointmentsComponent } from './pages/appointments/appointments.component';
import { AppointmentFiltersComponent } from './pages/appointments/components/appointment-filters/appointment-filters.component';
import { AppointmentFormComponent } from './pages/appointments/components/appointment-form/appointment-form.component';
import { AppointmentTableComponent } from './pages/appointments/components/appointment-table/appointment-table.component';
import { DayAgendaComponent } from './pages/dashboard/components/day-agenda/day-agenda.component';
import { QuickActionComponent } from './pages/dashboard/components/quick-action/quick-action.component';
import { StatCardComponent } from './pages/dashboard/components/stat-card/stat-card.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { AlertContainerComponent } from './shared/components/alert-container/alert-container.component';
import { AlertModalComponent } from './shared/components/alert-modal/alert-modal.component';
import { AlertComponent } from './shared/components/alert/alert.component';
import { ButtonComponent } from './shared/components/button/button.component';
import { ChatbotComponent } from './shared/components/chatbot/chatbot.component';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { TopbarComponent } from './shared/components/topbar/topbar.component';


@NgModule({
  declarations: [
    AppComponent,
    PublicLayoutComponent,
    AdminLayoutComponent,
    HomeComponent,
    LoginComponent,
    DashboardComponent,
    NavbarComponent,
    ButtonComponent,
    ChatbotComponent,
    AlertComponent,
    AlertModalComponent,
    AlertContainerComponent,
    QuickActionComponent,
    StatCardComponent,
    DayAgendaComponent,
    TopbarComponent,
    SidebarComponent,
    AppointmentsComponent,
    AppointmentTableComponent,
    AppointmentFormComponent,
    AppointmentFiltersComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}