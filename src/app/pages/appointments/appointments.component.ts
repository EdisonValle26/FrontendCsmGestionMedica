import { Component } from '@angular/core';
import { Appointment } from '../../core/interface/appointment.interface';
import { FilterField } from '../../core/interface/filter-field.interface';
import { FormField } from '../../core/interface/form-field.interface';
import { TableColumn } from '../../core/interface/table-column.interface';
import { AlertService } from '../../core/services/alert.service';
import { AppointmentsService } from '../../core/services/appointment.service';

@Component({
  selector: 'app-appointments',
  standalone: false,
  templateUrl: './appointments.component.html',
  styleUrl: './appointments.component.css'
})
export class AppointmentsComponent {

  appointments: Appointment[] = [];

  selectedAppointment: Appointment | null = null;
  isModalOpen = false;

  columns: TableColumn[] = [
    { label: 'Hora', field: 'time' },
    { label: 'Paciente', field: 'patient' },
    { label: 'Especialidad', field: 'specialty' },
    { label: 'Doctor', field: 'doctor' },
    { label: 'Estado', field: 'status', type: 'badge' }
  ];

  formFields: FormField[] = [
    { name: 'date', label: 'Fecha', type: 'date', required: true },
    { name: 'time', label: 'Hora', type: 'time', required: true },
    { name: 'patient', label: 'Paciente', type: 'text', required: true },
    { name: 'doctor', label: 'Doctor', type: 'text', required: true },
    { name: 'specialty', label: 'Especialidad', type: 'text', required: true },
    {
      name: 'status',
      label: 'Estado',
      type: 'select',
      required: true,
      options: [
        { label: 'Pendiente', value: 'pendiente' },
        { label: 'Confirmada', value: 'confirmada' },
        { label: 'Urgente', value: 'urgente' }
      ]
    }
  ];

  filtersConfig: FilterField[] = [
    { name: 'patient', label: 'Paciente', type: 'text' },
    {
      name: 'status',
      label: 'Estado',
      type: 'select',
      options: [
        { label: 'Pendiente', value: 'pendiente' },
        { label: 'Confirmada', value: 'confirmada' },
        { label: 'Urgente', value: 'urgente' }
      ]
    },
    { name: 'date', label: 'Fecha', type: 'date' }
  ];

  currentFilters: any = {};

  constructor(
    private serviceAppointment: AppointmentsService,
    private alertService: AlertService,
  ) { }

  ngOnInit() {
    this.loadAppointments();
  }

  loadAppointments() {
    this.serviceAppointment.getAll(this.currentFilters).subscribe(res => {
      this.appointments = [...res];
    });
  }

  openCreate() {
    this.selectedAppointment = null;
    this.isModalOpen = true;
  }

  onEdit(app: Appointment) {
    this.selectedAppointment = { ...app };
    this.isModalOpen = true;
  }

  onSave(app: Appointment) {
    if (this.selectedAppointment?.id) {
      app.id = this.selectedAppointment.id;

      this.serviceAppointment.update(app).subscribe(() => {
        this.alertService.success('Cita actualizada correctamente');
        this.loadAppointments();
        this.isModalOpen = false;
        this.selectedAppointment = null;
      });

    } else {
      this.serviceAppointment.create(app).subscribe(() => {
        this.alertService.success('Cita creada correctamente');
        this.loadAppointments();
        this.isModalOpen = false;
        this.selectedAppointment = null;
      });
    }
  }

  onDelete(id: number) {
    this.serviceAppointment.delete(id).subscribe(res => {
      this.appointments = [...res];
      this.alertService.success('Cita eliminada correctamente');
    });
  }

  onFilter(filters: any) {
    this.currentFilters = filters;

    this.serviceAppointment.getAll(filters).subscribe(res => {
      this.appointments = [...res];
    });
  }

}
