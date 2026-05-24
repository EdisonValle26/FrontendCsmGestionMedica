
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_ROUTES } from '../config/api-routes';
import { environment } from '../config/environment';

@Injectable({
    providedIn: 'root'
})
export class CatalogsService {

    private apiUrl = environment.apiUrl;

    constructor(
        private http: HttpClient
    ) { }

    getByType(type: string): Observable<any> {
        return this.http.get<any>(
            `${this.apiUrl}${API_ROUTES.CATALOGS}/type/${type}`
        );
    }

}