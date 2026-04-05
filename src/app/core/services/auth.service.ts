import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {

  login(email: string, password: string) {

    // llamada al backend
    if (email === 'admin@test.com' && password === '1234') {

      localStorage.setItem('token', 'fake-jwt-token');
      return true;
    }

    return false;
  }

  isLogged(): boolean {
    return !!localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
  }
}