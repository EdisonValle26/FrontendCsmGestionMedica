import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { API_ROUTES } from '../../core/config/api-routes';
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

  onConfirm() {
    this.showModal = false;
  }

  onLogin() {

    this.auth.login(this.email, this.password)
      .subscribe({

        next: () => {

          this.alert.success('Bienvenido');

          this.router.navigate([API_ROUTES.DASHBOARD]);

        },

        error: (err) => {

          this.alert.error(
            err?.error?.message || 'Credenciales incorrectas'
          );

        }

      });

  }
}