import { Component } from '@angular/core';
import { Appointment } from '../../core/interface/appointment.interface';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  appointments: Appointment[] = [
    {
      time: '08:00',
      patient: 'María González',
      specialty: 'Cardiología',
      doctor: 'Dr. Mora',
      status: 'confirmada'
    },
    {
      time: '09:30',
      patient: 'Luis Fernández',
      specialty: 'Pediatría',
      doctor: 'Dra. Vega',
      status: 'pendiente'
    },
    {
      time: '11:00',
      patient: 'Roberto Díaz',
      specialty: 'Neurología',
      doctor: 'Dr. Ruiz',
      status: 'urgente'
    }
  ];

}
