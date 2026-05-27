import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_ROUTES } from '../config/api-routes';
import { environment } from '../config/environment';
import { PermissionPayload } from '../interface/permission.interface';

@Injectable({
    providedIn: 'root'
})
export class PermissionsService {

    private apiUrl = environment.apiUrl;

    constructor(
        private http: HttpClient
    ) { }

    getAll(filters?: any): Observable<any> {

        let params = new HttpParams()
            .set('skip', filters?.skip || 0)
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
            `${this.apiUrl}${API_ROUTES.PERMISSIONS}`,
            { params }
        );
    }

    getById(id: number): Observable<any> {
        return this.http.get<any>(
            `${this.apiUrl}${API_ROUTES.PERMISSIONS}/${id}`
        );
    }

    create(payload: PermissionPayload): Observable<any> {
        return this.http.post<any>(
            `${this.apiUrl}${API_ROUTES.PERMISSIONS}`,
            payload
        );
    }

    update(payload: PermissionPayload): Observable<any> {
        return this.http.put<any>(
            `${this.apiUrl}${API_ROUTES.PERMISSIONS}`,
            payload
        );
    }

    delete(id: number): Observable<any> {
        return this.http.delete<any>(
            `${this.apiUrl}${API_ROUTES.PERMISSIONS}/${id}`
        );
    }

}