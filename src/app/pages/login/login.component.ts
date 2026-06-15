import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { API_ROUTES } from '../../core/config/api-routes';
import { FormField } from '../../core/interface/form-field.interface';
import { AlertService } from '../../core/services/alert.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  formFields: FormField[] = [
    { name: 'username', label: 'Usuario', type: 'text', inputType: 'alphanumeric', required: true },
    { name: 'password', label: 'Contraseña', type: 'password', required: true },
  ];

  currentYear = new Date().getFullYear();

  constructor(
    private auth: AuthService,
    private router: Router,
    private alert: AlertService
  ) { }

  onLogin(data: any) {

    this.auth.login(data.username, data.password)
      .subscribe({
        next: () => {
          this.alert.success('Bienvenido');
          this.router.navigate([API_ROUTES.DASHBOARD]);
        },

        error: (err) => {
          this.alert.error(err?.error?.message || 'Credenciales incorrectas');
        }

      });
  }
}