import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { API_ROUTES } from '../config/api-routes';
import { environment } from '../config/environment';
import { LoginResponse } from '../interface/auth.interface';
import { TokenService } from './token.service';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private baseUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private tokenService: TokenService
  ) { }

  login(username: string, password: string): Observable<boolean> {

    return this.http.post<LoginResponse>(
      `${this.baseUrl}${API_ROUTES.LOGIN}`,
      {
        username,
        password
      }
    ).pipe(

      map((response) => {

        this.tokenService.setToken(response.access_token);

        this.tokenService.setUser(response.user);

        return true;
      })

    );

  }

  logout() {
    this.tokenService.clear();
  }

  isLogged(): boolean {
    return !!this.tokenService.getToken();
  }

  getUser() {
    return this.tokenService.getUser();
  }

  getToken() {
    return this.tokenService.getToken();
  }

}