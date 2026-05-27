
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_ROUTES } from '../config/api-routes';
import { environment } from '../config/environment';
import { Specialities } from '../interface/specialties.interface';

@Injectable({
    providedIn: 'root'
})
export class SpecialtyService {

    private apiUrl = environment.apiUrl;

    constructor(
        private http: HttpClient
    ) { }

    getAll(filters?: any): Observable<any> {

        let params = new HttpParams()
            .set('skip', filters?.skip || 1)
            .set('take', filters?.take || 10);

        if (filters?.status) {
            params = params.set('status', filters.status);
        }

        if (filters?.field) {
            params = params.set('field', filters.field);
        }

        if (filters?.value_field) {
            params = params.set('value_field', filters.value_field);
        }

        return this.http.get<any>(
            `${this.apiUrl}${API_ROUTES.SPECIALTIES}`,
            { params }
        );
    }

    getById(id: number): Observable<any> {
        return this.http.get<any>(
            `${this.apiUrl}${API_ROUTES.SPECIALTIES}/${id}`
        );
    }

    create(payload: Specialities): Observable<any> {
        return this.http.post<any>(
            `${this.apiUrl}${API_ROUTES.SPECIALTIES}`,
            payload
        );
    }

    update(id: number, payload: Specialities): Observable<any> {
        return this.http.put<any>(
            `${this.apiUrl}${API_ROUTES.SPECIALTIES}/${id}`,
            payload
        );
    }

    delete(id: number): Observable<any> {
        return this.http.delete<any>(
            `${this.apiUrl}${API_ROUTES.SPECIALTIES}/${id}`
        );
    }

}