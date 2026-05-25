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


  getStatusClass(status: string | null | undefined) {

    switch (status) {

      case 'Pendiente':
        return 'bg-yellow-100 text-yellow-600 border-yellow-200';

      case 'Confirmada':
        return 'bg-green-100 text-green-600 border-green-200';

      case 'Cancelada':
        return 'bg-red-100 text-red-600 border-red-200';

      case 'Completada':
        return 'bg-blue-100 text-blue-600 border-blue-200';

      case 'No asistió':
        return 'bg-gray-100 text-gray-600 border-gray-200';

      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  }
}
