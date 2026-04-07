import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { Appointment } from "../interface/appointment.interface";

@Injectable({ providedIn: 'root' })
export class AppointmentsService {

    private appointments: Appointment[] = [
        {
            id: 1,
            date: '2026-04-10',
            time: '10:00',
            patient: 'Juan Pérez',
            doctor: 'Dr. Gómez',
            specialty: 'Cardiología',
            status: 'pendiente'
        }
    ];

    getAll(filters?: any): Observable<Appointment[]> {

        let result = [...this.appointments];

        if (filters) {

            Object.keys(filters).forEach(key => {

                const value = filters[key];

                if (value !== null && value !== undefined && value !== '') {

                    result = result.filter(item => {

                        const fieldValue = item[key as keyof Appointment];

                        if (typeof fieldValue === 'string') {
                            return fieldValue.toLowerCase().includes(value.toLowerCase());
                        }

                        return fieldValue === value;
                    });

                }

            });

        }

        return of(result);
    }

    create(app: Appointment): Observable<Appointment> {
        app.id = Date.now();
        this.appointments.push(app);
        return of(app);
    }

    update(app: Appointment): Observable<Appointment> {
        const index = this.appointments.findIndex(a => a.id === app.id);

        if (index !== -1) {
            this.appointments[index] = app;
        }

        return of(app);
    }

    delete(id: number): Observable<Appointment[]> {
        this.appointments = this.appointments.filter(a => a.id !== id);
        return of(this.appointments);
    }
}