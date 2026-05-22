import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  private TOKEN_KEY = 'token';
  private USER_KEY = 'user';

  setToken(token: string) {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  removeToken() {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  setUser(user: any) {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  getUser() {
    const data = localStorage.getItem(this.USER_KEY);

    return data ? JSON.parse(data) : null;
  }

  removeUser() {
    localStorage.removeItem(this.USER_KEY);
  }

  clear() {
    this.removeToken();
    this.removeUser();
  }

  isLogged(): boolean {
    return !!this.getToken();
  }

  getRoles(): string[] {
    return this.getUser()?.roles || [];
  }
}