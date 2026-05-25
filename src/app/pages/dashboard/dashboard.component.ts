import { Component } from '@angular/core';
import { Appointment } from '../../core/interface/appointment.interface';
import { AppointmentsService } from '../../core/services/appointment.service';
import { DoctorService } from '../../core/services/doctor.service';
import { PatientsService } from '../../core/services/patients.service';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  appointments: Appointment[] = [];

  totalAppointmentsToday = 0;
  totalPatients = 0;
  totalDoctors = 0;

  loading = false;

  constructor(
    private serviceAppointment: AppointmentsService,
    private servicePatients: PatientsService,
    private serviceDoctor: DoctorService
  ) { }

  ngOnInit() {
    this.loadDashboard();
  }

  loadDashboard() {

    this.loading = true;

    const today = new Date().toISOString().split('T')[0];

    const appointmentFilters = {
      skip: 1,
      take: 20,
      date: today
    };

    this.serviceAppointment
      .getAll(appointmentFilters)
      .subscribe({

        next: (res) => {

          this.appointments = res.data.map((item: any) => {

            return {
              id: item.id,

              patient:
                `${item.patients?.persons?.first_name || ''} ${item.patients?.persons?.last_name || ''}`,

              doctor:
                `${item.doctors?.persons?.first_name || ''} ${item.doctors?.persons?.last_name || ''}`,

              specialty_name:
                item.specialties?.name || '',

              appointment_time:
                item.appointment_time
                  ? item.appointment_time.split('T')[1]
                    .split(':')
                    .slice(0, 2)
                    .join(':')
                  : '',

              status_name:
                item.catalogs_appointments_status_idTocatalogs?.value || ''
            };
          });

          this.totalAppointmentsToday = this.appointments.length;

          this.loading = false;
        },

        error: () => {
          this.loading = false;
        }
      });

    this.servicePatients.getAll({
      skip: 1,
      take: 1
    }).subscribe({
      next: (res) => {
        this.totalPatients = res.total || 0;
      }
    });

    this.serviceDoctor.getAll({
      skip: 1,
      take: 1
    }).subscribe({
      next: (res) => {
        this.totalDoctors = res.total || 0;
      }
    });
  }
}