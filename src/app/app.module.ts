import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminLayoutComponent } from './layout/admin-layout/admin-layout.component';
import { PublicLayoutComponent } from './layout/public-layout/public-layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { ButtonComponent } from './shared/components/button/button.component';
import { ChatbotComponent } from './shared/components/chatbot/chatbot.component';
import { NavbarComponent } from './shared/components/navbar/navbar.component';


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
    ChatbotComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}