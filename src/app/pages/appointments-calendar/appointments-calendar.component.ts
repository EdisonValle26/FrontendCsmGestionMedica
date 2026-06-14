import { Component, OnInit } from '@angular/core';
import { AlertService } from '../../core/services/alert.service';
import { AppointmentsService } from '../../core/services/appointment.service';

@Component({
  selector: 'app-appointments-calendar',
  standalone: false,
  templateUrl: './appointments-calendar.component.html',
  styleUrl: './appointments-calendar.component.css'
})
export class AppointmentsCalendarComponent implements OnInit {

  currentDate: Date = new Date();
  currentMonth: string = '';
  currentYear: number = 0;
  calendarDays: any[] = [];
  weekDays: string[] = ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'];

  appointments: any[] = [];

  // Modal de citas del día
  showAppointmentsModal = false;
  selectedDayAppointments: any[] = [];
  selectedDayDate: Date | null = null;

  currentFilters: any = {
    skip: 1,
    take: 5,
    status: 'A',
    field: ['', '', '', '', '', '']
  };

  /* PAGINACIÓN */
  totalAppointments = 0;
  page = 1;
  take = 5;
  takeOptions = [5, 10, 25, 50];
  loading = false;

  constructor(
    private serviceAppointment: AppointmentsService,
    private alertService: AlertService,
  ) { }

  ngOnInit(): void {
    this.loadAppointments();
  }

  loadAppointments() {

    this.loading = true;
    this.currentFilters.skip = this.page;
    this.currentFilters.take = this.take;

    this.serviceAppointment
      .getAll(this.currentFilters)
      .subscribe({

        next: (res) => {

          this.appointments = res.data.map((item: any) => {

            const appointmentDate = item.appointment_date
              ? new Date(item.appointment_date.split('T')[0] + 'T00:00:00')
              : null;

            const statusCatalog =
              item.catalogs_appointments_status_idTocatalogs;

            return {
              id: item.id,

              patient_name:
                `${item.patients?.persons?.first_name ?? ''} ${item.patients?.persons?.last_name ?? ''}`,

              doctor_name:
                `${item.doctors?.persons?.first_name ?? ''} ${item.doctors?.persons?.last_name ?? ''}`,

              specialty:
                item.specialties?.name ?? '',

              date: appointmentDate,

              time: item.appointment_time
                ? item.appointment_time.substring(11, 16)
                : '',

              statusCode: statusCatalog?.code ?? '',
              statusName: statusCatalog?.value ?? '',

              notes: item.notes ?? '',
              reason: item.reason ?? '',

              appointment_type:
                item.catalogs_appointments_appointment_type_idTocatalogs?.value ?? ''
            };
          });
          this.updateCalendar();
          this.loading = false;
        },

        error: () => {
          this.loading = false;
          this.alertService.error(
            'Error al cargar pacientes'
          );
        }
      });
  }

  getBadgeClass(statusCode: string): string {

    switch (statusCode) {

      case 'CONFIRMADO':
        return 'bg-green-100 text-green-800';

      case 'COMPLETADO':
        return 'bg-blue-100 text-blue-800';

      case 'NO ASISTIO':
        return 'bg-red-100 text-red-800';

      case 'CANCELADO':
        return 'bg-gray-100 text-gray-800';

      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  updateCalendar() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    this.currentYear = year;
    this.currentMonth = this.getMonthName(month);

    const firstDayOfMonth = new Date(year, month, 1);
    const startingDayOfWeek = firstDayOfMonth.getDay();

    const startDate = new Date(year, month, 1);
    startDate.setDate(startDate.getDate() - startingDayOfWeek);

    this.calendarDays = [];

    for (let i = 0; i < 42; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);

      const isCurrentMonth = currentDate.getMonth() === month;
      const dayNumber = currentDate.getDate();

      const dayAppointments = this.appointments.filter(apt =>
        apt.date &&
        apt.date.getDate() === currentDate.getDate() &&
        apt.date.getMonth() === currentDate.getMonth() &&
        apt.date.getFullYear() === currentDate.getFullYear()
      );

      // Ordenar citas por hora
      dayAppointments.sort((a, b) => a.time.localeCompare(b.time));

      this.calendarDays.push({
        date: currentDate,
        isCurrentMonth: isCurrentMonth,
        dayNumber: dayNumber,
        appointments: dayAppointments,
        isToday: this.isToday(currentDate),
        // Mostrar solo las primeras 2 citas en la celda
        displayAppointments: dayAppointments.slice(0, 2),
        hasMoreAppointments: dayAppointments.length > 2,
        remainingCount: dayAppointments.length - 2
      });
    }
  }

  getMonthName(month: number): string {
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    return months[month];
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  }

  previousMonth() {
    this.currentDate.setMonth(this.currentDate.getMonth() - 1);
    this.updateCalendar();
  }

  nextMonth() {
    this.currentDate.setMonth(this.currentDate.getMonth() + 1);
    this.updateCalendar();
  }

  goToToday() {
    this.currentDate = new Date();
    this.updateCalendar();
  }

  getAppointmentStatusClass(statusCode: string): string {

    switch (statusCode) {

      case 'CONFIRMADO':
        return 'bg-green-100 text-green-800 border-l-4 border-green-500';

      case 'COMPLETADO':
        return 'bg-blue-100 text-blue-800 border-l-4 border-blue-500';

      case 'NO ASISTIO':
        return 'bg-red-100 text-red-800 border-l-4 border-red-500';

      case 'CANCELADO':
        return 'bg-gray-100 text-gray-800 border-l-4 border-gray-500';

      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getAppointmentIcon(statusCode: string): string {

    switch (statusCode) {

      case 'CONFIRMADO':
        return 'fas fa-check-circle';

      case 'COMPLETADO':
        return 'fas fa-stethoscope';

      case 'NO ASISTIO':
        return 'fas fa-user-times';

      case 'CANCELADO':
        return 'fas fa-times-circle';

      default:
        return 'fas fa-calendar-check';
    }
  }

  formatTime(time: Date): string {
    if (typeof time === 'string') return time;
    return time.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  }

  selectDay(day: any) {
    if (day.appointments.length === 0) return;

    this.selectedDayDate = day.date;
    this.selectedDayAppointments = day.appointments;
    this.showAppointmentsModal = true;
  }

  closeModal() {
    this.showAppointmentsModal = false;
    this.selectedDayAppointments = [];
    this.selectedDayDate = null;
  }

  getFormattedDate(date: Date): string {
    if (!date) return '';
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    return `${days[date.getDay()]}, ${date.getDate()} de ${months[date.getMonth()]} de ${date.getFullYear()}`;
  }
}