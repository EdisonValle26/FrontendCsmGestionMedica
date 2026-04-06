import { Component, Input } from '@angular/core';
import { Appointment } from '../../../../core/interface/appointment.interface';

@Component({
  selector: 'app-day-agenda',
  standalone: false,
  templateUrl: './day-agenda.component.html',
  styleUrl: './day-agenda.component.css'
})
export class DayAgendaComponent {

  @Input() appointments: Appointment[] = [];

  getStatusClass(status: string) {
    switch (status) {
      case 'confirmada':
        return 'bg-green-100 text-green-600 border-green-200';
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-600 border-yellow-200';
      case 'urgente':
        return 'bg-red-100 text-red-600 border-red-200';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  }
}
