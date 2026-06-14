import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_ROUTES } from '../config/api-routes';
import { environment } from '../config/environment';

@Injectable({
    providedIn: 'root'
})
export class DoctorScheduleService {

    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) { }

    getByDoctor(doctorId: number): Observable<any[]> {
        return this.http.get<any[]>(
            `${this.apiUrl}${API_ROUTES.DOCTOR_SCHEDULES}/${doctorId}`
        );
    }

    getAvailableSlots(params: any): Observable<any> {
        return this.http.get<any>(
            `${this.apiUrl}${API_ROUTES.DOCTOR_SCHEDULES}/available-slots`,
            { params }
        );
    }

    create(payload: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}${API_ROUTES.DOCTOR_SCHEDULES}`, payload);
    }

    update(id: number, payload: any): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}${API_ROUTES.DOCTOR_SCHEDULES}/${id}`, payload);
    }

    delete(id: number): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}${API_ROUTES.DOCTOR_SCHEDULES}/${id}`);
    }
}