import { Component } from '@angular/core';
import { Appointment } from '../../core/interface/appointment.interface';
import { FilterField } from '../../core/interface/filter-field.interface';
import { FormField } from '../../core/interface/form-field.interface';
import { TableColumn } from '../../core/interface/table-column.interface';
import { AlertService } from '../../core/services/alert.service';
import { AppointmentsService } from '../../core/services/appointment.service';

@Component({
  selector: 'app-patients',
  standalone: false,
  templateUrl: './patients.component.html',
  styleUrl: './patients.component.css'
})
export class PatientsComponent {

  patients: Appointment[] = [];

  selectedPatients: Appointment | null = null;
  isModalOpen = false;

  columns: TableColumn[] = [
    { label: 'Identificación', field: 'specialty' },
    { label: 'Paciente', field: 'patient' },
    { label: 'Teléfono', field: 'time' },
    { label: 'Correo', field: 'doctor' },
    { label: 'Tipo de Identificación', field: 'status', type: 'badge' }
  ];

  formFields: FormField[] = [
    { name: 'specialty', label: 'Identificación', type: 'text', required: true },
    { name: 'patient', label: 'Paciente', type: 'text', required: true },
    { name: 'time', label: 'Teléfono', type: 'time', required: true },
    { name: 'doctor', label: 'Correo', type: 'text', required: true },
    {
      name: 'status',
      label: 'Tipo de Identificación',
      type: 'select',
      required: true,
      options: [
        { label: 'Cédula', value: 'cedula' },
        { label: 'RUC', value: 'ruc' },
        { label: 'Pasaporte', value: 'pasaporte' }
      ]
    }
  ];

  filtersConfig: FilterField[] = [
    { name: 'patient', label: 'Paciente', type: 'text' },
    {
      name: 'status',
      label: 'Tipo de Identificación',
      type: 'select',
      options: [
        { label: 'Cédula', value: 'cedula' },
        { label: 'RUC', value: 'ruc' },
        { label: 'Pasaporte', value: 'pasaporte' }
      ]
    }
  ];

  currentFilters: any = {};

  constructor(
    private serviceAppointment: AppointmentsService,
    private alertService: AlertService,
  ) { }

  ngOnInit() {
    this.loadPatients();
  }

  loadPatients() {
    this.serviceAppointment.getAll(this.currentFilters).subscribe(res => {
      this.patients = [...res];
    });
  }

  openCreate() {
    this.selectedPatients = null;
    this.isModalOpen = true;
  }

  onEdit(app: Appointment) {
    this.selectedPatients = { ...app };
    this.isModalOpen = true;
  }

  onSave(app: Appointment) {
    if (this.selectedPatients?.id) {
      app.id = this.selectedPatients.id;

      this.serviceAppointment.update(app).subscribe(() => {
        this.alertService.success('Paciente actualizado correctamente');
        this.loadPatients();
        this.isModalOpen = false;
        this.selectedPatients = null;
      });

    } else {
      this.serviceAppointment.create(app).subscribe(() => {
        this.alertService.success('Paciente creado correctamente');
        this.loadPatients();
        this.isModalOpen = false;
        this.selectedPatients = null;
      });
    }
  }

  onDelete(id: number) {
    this.serviceAppointment.delete(id).subscribe(res => {
      this.patients = [...res];
      this.alertService.success('Paciente eliminado correctamente');
    });
  }

  onFilter(filters: any) {
    this.currentFilters = filters;

    this.serviceAppointment.getAll(filters).subscribe(res => {
      this.patients = [...res];
    });
  }

}
