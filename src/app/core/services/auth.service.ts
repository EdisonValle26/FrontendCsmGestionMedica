import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  login(data: any) {
    console.log('Login', data);
  }

  logout() {
    console.log('Logout');
  }

}