import { Component } from '@angular/core';
import { Appointment } from '../../core/interface/appointment.interface';
import { FilterField } from '../../core/interface/filter-field.interface';
import { FormField } from '../../core/interface/form-field.interface';
import { TableColumn } from '../../core/interface/table-column.interface';
import { AlertService } from '../../core/services/alert.service';
import { AppointmentsService } from '../../core/services/appointment.service';
import { CatalogsService } from '../../core/services/catalogs.service';
import { DoctorService } from '../../core/services/doctor.service';
import { PatientsService } from '../../core/services/patients.service';
import { SpecialtyService } from '../../core/services/specialty.service';

@Component({
  selector: 'app-appointments',
  standalone: false,
  templateUrl: './appointments.component.html',
  styleUrl: './appointments.component.css'
})
export class AppointmentsComponent {

  appointments: Appointment[] = [];
  selectedAppointments: Appointment | null = null;
  isModalOpen = false;
  loading = false;
  mode: 'create' | 'edit' | 'view' = 'create';

  columns: TableColumn[] = [
    { label: 'Fecha', field: 'appointment_date' },
    { label: 'Hora', field: 'appointment_time' },
    { label: 'Paciente', field: 'patient' },
    { label: 'Doctor', field: 'doctor' },
    { label: 'Especialidad', field: 'specialty_name' },
    { label: 'Tipo', field: 'appointment_type_name' },
    { label: 'Estado', field: 'status_name', type: 'badge' }
  ];

  formFields: FormField[] = [
    { name: 'patient_id', label: 'Paciente', type: 'select', required: true, options: [] },
    { name: 'doctor_id', label: 'Doctor', type: 'select', required: true, options: [] },
    { name: 'specialty_id', label: 'Especialidad', type: 'select', required: true, options: [] },
    { name: 'appointment_type_id', label: 'Tipo', type: 'select', required: true, options: [] },
    { name: 'appointment_status_id', label: 'Estado', type: 'select', required: true, options: [] },
    { name: 'appointment_date', label: 'Fecha', type: 'date', required: true },
    { name: 'appointment_time', label: 'Hora', type: 'time', required: true },
    // { name: 'duration_minutes', label: 'Duración', type: 'time', required: true },
    { name: 'reason', label: 'Motivo', type: 'textarea', inputType: 'alphanumeric', required: true },
    { name: 'notes', label: 'Notas', type: 'text', inputType: 'alphanumeric' },
  ];

  filtersConfig: FilterField[] = [
    { name: 'value_field', label: 'Buscar Cita', type: 'text' }
  ];

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

  /* DELETE MODAL */
  showDeleteModal = false;
  appointmentIdToDelete: number | null = null;

  constructor(
    private serviceAppointment: AppointmentsService,
    private alertService: AlertService,
    private catalogsService: CatalogsService,
    private servicePatients: PatientsService,
    private serviceSpecialty: SpecialtyService,
    private serviceDoctor: DoctorService,
  ) { }

  ngOnInit() {
    this.loadAppointments();
    this.loadCatalogs();
    this.loadPatient();
    this.loadDoctor();
    this.loadSpecialty();
  }

  loadAppointments() {

    this.loading = true;
    this.currentFilters.skip = this.page;
    this.currentFilters.take = this.take;

    this.serviceAppointment
      .getAll(this.currentFilters)
      .subscribe({

        next: (res) => {

          this.totalAppointments = res.total || 0;
          this.page = res.page || 1;
          this.take = res.limit || 5;
          this.appointments = res.data.map((item: any) => {

            return {
              id: item.id,
              patient_id: item.patient_id || null,
              patient: `${item.patients.persons?.first_name || ''} ${item.patients.persons?.last_name || ''}`,
              doctor_id: item.doctor_id || null,
              doctor: `${item.doctors.persons?.first_name || ''} ${item.doctors.persons?.last_name || ''}`,
              specialty_id: item.specialty_id || null,
              appointment_status_id: item.status_id || '',
              appointment_type_id: item.appointment_type_id || '',
              appointment_date: item.appointment_date ? item.appointment_date.split('T')[0] : '',
              appointment_time: item.appointment_time ? item.appointment_time.split('T')[1].split(':').slice(0, 2).join(':') : '',
              reason: item.reason,
              notes: item.notes,
              specialty_name: item.specialties.name || '',
              appointment_type_name: item?.catalogs_appointments_appointment_type_idTocatalogs?.value || '',
              status_name: item?.catalogs_appointments_status_idTocatalogs?.value || '',
            };
          });
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

  openCreate() {
    this.selectedAppointments = null;
    this.isModalOpen = true;
    this.mode = 'create';
  }

  onEdit(appointment: any) {
    this.selectedAppointments = {
      ...appointment
    };
    this.isModalOpen = true;
    this.mode = 'edit';
  }

  onView(appointment: any) {
    this.selectedAppointments = {
      ...appointment
    };
    this.isModalOpen = true;
    this.mode = 'view';
  }

  onSave(data: Appointment) {

    const payload = {
      patient_id: Number(data.patient_id),
      doctor_id: Number(data.doctor_id),
      specialty_id: Number(data.specialty_id),
      appointment_date: data.appointment_date,
      appointment_time: data.appointment_time,
      duration_minutes: 30,
      appointment_type_id: Number(data.appointment_type_id),
      appointment_status_id: Number(data.appointment_status_id),
      reason: data.reason,
      notes: data.notes,
    };

    if (this.selectedAppointments?.id) {

      this.serviceAppointment
        .update(this.selectedAppointments.id, payload)
        .subscribe({

          next: () => {
            this.alertService.success(
              'Cita actualizada correctamente'
            );
            this.loadAppointments();
            this.isModalOpen = false;

          },

          error: () => {
            this.alertService.error(
              'Error al actualizar cita'
            );
          }
        });

    } else {

      this.serviceAppointment
        .create(payload)
        .subscribe({

          next: () => {
            this.alertService.success(
              'Cita creada correctamente'
            );
            this.loadAppointments();
            this.isModalOpen = false;
          },

          error: () => {
            this.alertService.error(
              'Error al crear cita'
            );
          }
        });
    }
  }

  onDelete(id: number) {
    this.appointmentIdToDelete = id;
    this.showDeleteModal = true;
  }

  onFilter(filters: any) {
    this.currentFilters = {
      ...this.currentFilters,
      value_field: filters.value_field || ''
    };
    this.loadAppointments();
  }

  onPageChange(page: number) {
    this.page = page;
    this.loadAppointments();
  }

  onTakeChange(take: number) {
    this.take = take;
    this.page = 1;
    this.loadAppointments();

  }
  confirmDelete() {

    if (!this.appointmentIdToDelete) {
      return;
    }

    this.serviceAppointment
      .delete(this.appointmentIdToDelete)
      .subscribe({

        next: () => {
          this.alertService.success(
            'Paciente eliminado correctamente'
          );
          this.loadAppointments();
          this.showDeleteModal = false;
        },

        error: () => {
          this.alertService.error(
            'Error al eliminar paciente'
          );
        }
      });
  }

  loadCatalogs() {

    // APPOINTMENT STATUS
    this.catalogsService.getByType('APPOINTMENT_STATUS').subscribe({
      next: (res) => {

        const field = this.formFields.find(
          f => f.name === 'appointment_status_id'
        );

        if (field) {
          field.options = res.map((item: any) => (
            { label: item.value, value: item.id }
          ));
        }
      }
    });

    // APPOINTMENT TYPE
    this.catalogsService.getByType('APPOINTMENT_TYPE').subscribe({
      next: (res) => {

        const field = this.formFields.find(
          f => f.name === 'appointment_type_id'
        );

        if (field) {
          field.options = res.map((item: any) => (
            { label: item.value, value: item.id }
          ));
        }
      }
    });
  }

  loadPatient() {
    const filter = {
      skip: 1,
      take: 9999,
      status: 'A',
    };

    this.servicePatients.getAll(filter)
      .subscribe({

        next: (res) => {
          const field = this.formFields.find(
            f => f.name === 'patient_id'
          );

          if (field) {
            field.options = res.data.map((item: any) => (
              { label: `${item.persons?.identification || ''} - ${item.persons?.first_name || ''} ${item.persons?.last_name || ''}`, value: item.id }
            ));
          }
        }
      });
  }

  loadDoctor() {
    const filter = {
      skip: 1,
      take: 9999,
      status: 'A',
    };

    this.serviceDoctor.getAll(filter)
      .subscribe({

        next: (res) => {
          const field = this.formFields.find(
            f => f.name === 'doctor_id'
          );

          if (field) {
            field.options = res.data.map((item: any) => (
              { label: `${item.persons?.identification || ''} - ${item.persons?.first_name || ''} ${item.persons?.last_name || ''}`, value: item.id }
            ));
          }
        }
      });
  }

  loadSpecialty() {
    const filter = {
      skip: 1,
      take: 9999,
      status: 'A',
    };

    this.serviceSpecialty.getAll(filter)
      .subscribe({

        next: (res) => {
          const field = this.formFields.find(
            f => f.name === 'specialty_id'
          );

          if (field) {
            field.options = res.data.map((item: any) => (
              { label: item.name, value: item.id }
            ));
          }
        }
      });
  }

}