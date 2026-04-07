import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminLayoutComponent } from './layout/admin-layout/admin-layout.component';
import { PublicLayoutComponent } from './layout/public-layout/public-layout.component';
import { AppointmentsComponent } from './pages/appointments/appointments.component';
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
import { FiltersComponent } from './shared/components/filters/filters.component';
import { FormComponent } from './shared/components/form/form.component';
import { ModalContainerComponent } from './shared/components/modal-container/modal-container.component';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { TableComponent } from './shared/components/table/table.component';
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
    TableComponent,
    FormComponent,
    FiltersComponent,
    ModalContainerComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}