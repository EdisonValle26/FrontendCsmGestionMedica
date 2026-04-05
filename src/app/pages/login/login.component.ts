import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from '../../core/services/alert.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  email = '';
  password = '';

  //Alert
  alertMessage = '';
  alertType: 'success' | 'error' | 'warning' | 'info' = 'info';
  showAlert = false;

  //Alert Modal
  showModal = false;

  constructor(
    private auth: AuthService,
    private router: Router,
    private alert: AlertService
  ) { }

  // onLogin() {
  //   const success = this.auth.login(this.email, this.password);

  //   if (success) {
  //     this.router.navigate(['/dashboard']);
  //   } else {
  //     this.alertMessage = 'Credenciales incorrectas';
  //     this.alertType = 'error';
  //     this.showAlert = true;

  //     setTimeout(() => {
  //       this.showAlert = false;
  //     }, 3000);
  //   }
  // }

  //Alerta Modal
  // onLogin() {
  //   const success = this.auth.login(this.email, this.password);

  //   if (success) {
  //     this.router.navigate(['/dashboard']);
  //   } else {
  //     this.showModal = true;
  //   }
  // }

  onConfirm() {
    this.showModal = false;
  }

  onLogin() {
    const success = this.auth.login(this.email, this.password);

    if (success) {
      this.alert.success('Bienvenido 👨‍⚕️');
      this.router.navigate(['/dashboard']);
    } else {
      this.alert.error('Credenciales incorrectas');
    }
  }
}