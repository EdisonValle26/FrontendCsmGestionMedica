import { Component } from '@angular/core';
import { FilterField } from '../../core/interface/filter-field.interface';
import { FormField } from '../../core/interface/form-field.interface';
import { Patient } from '../../core/interface/patient.interface';
import { TableColumn } from '../../core/interface/table-column.interface';
import { AlertService } from '../../core/services/alert.service';
import { PatientsService } from '../../core/services/patients.service';

@Component({
  selector: 'app-patients',
  standalone: false,
  templateUrl: './patients.component.html',
  styleUrl: './patients.component.css'
})
export class PatientsComponent {

  patients: Patient[] = [];
  selectedPatients: any = null;
  isModalOpen = false;
  loading = false;

  columns: TableColumn[] = [
    { label: 'Identificación', field: 'identification' },
    { label: 'Paciente', field: 'patient' },
    { label: 'Teléfono', field: 'phone' },
    { label: 'Correo', field: 'email' },
    { label: 'Historial', field: 'medical_history' }
  ];

  formFields: FormField[] = [
    { name: 'identification', label: 'Identificación', type: 'text', required: true },
    { name: 'first_name', label: 'Nombres', type: 'text', required: true },
    { name: 'last_name', label: 'Apellidos', type: 'text', required: true },
    { name: 'phone', label: 'Teléfono', type: 'text' },
    { name: 'email', label: 'Correo', type: 'text' },
    { name: 'address', label: 'Dirección', type: 'text' },
    { name: 'medical_history', label: 'Historial Médico', type: 'textarea' }
  ];

  filtersConfig: FilterField[] = [
    { name: 'value_field', label: 'Buscar paciente', type: 'text' }
  ];

  currentFilters: any = {
    skip: 1,
    take: 5,
    status: 'A',
    field: 'name'
  };

  /* PAGINACIÓN */
  totalPatients = 0;
  page = 1;
  take = 5;
  takeOptions = [5, 10, 25, 50];

  /* DELETE MODAL */
  showDeleteModal = false;
  patientIdToDelete: number | null = null;


  constructor(
    private servicePatients: PatientsService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.loadPatients();
  }

  loadPatients() {

    this.loading = true;
    this.currentFilters.skip = this.page;
    this.currentFilters.take = this.take;

    this.servicePatients
      .getAll(this.currentFilters)
      .subscribe({

        next: (res) => {

          this.totalPatients = res.total || 0;
          this.page = res.page || 1;
          this.take = res.limit || 5;
          this.patients = res.data.map((item: any) => {

            return {

              id: item.id,
              identification: item.persons?.identification || '',
              first_name: item.persons?.first_name || '',
              last_name: item.persons?.last_name || '',
              patient: `${item.persons?.first_name || ''} ${item.persons?.last_name || ''}`,
              phone: item.persons?.phone || '',
              email: item.persons?.email || '',
              address: item.persons?.address || '',
              medical_history: item.medical_history || ''
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
    this.selectedPatients = null;
    this.isModalOpen = true;
  }

  onEdit(patient: any) {
    this.selectedPatients = {
      ...patient
    };
    this.isModalOpen = true;
  }

  onSave(data: Patient) {

    const payload = {
      identification: data.identification,
      document_type_id: 1,
      first_name: data.first_name,
      last_name: data.last_name,
      birth_date: '1995-01-01',
      gender_id: 1,
      nationality_id: 1,
      phone: data.phone,
      email: data.email,
      address: data.address,
      medical_history: data.medical_history
    };

    if (this.selectedPatients?.id) {

      this.servicePatients
        .update(this.selectedPatients.id, payload)
        .subscribe({

          next: () => {
            this.alertService.success(
              'Paciente actualizado correctamente'
            );
            this.loadPatients();
            this.isModalOpen = false;

          },

          error: () => {
            this.alertService.error(
              'Error al actualizar paciente'
            );
          }
        });

    } else {

      this.servicePatients
        .create(payload)
        .subscribe({

          next: () => {
            this.alertService.success(
              'Paciente creado correctamente'
            );
            this.loadPatients();
            this.isModalOpen = false;
          },

          error: () => {
            this.alertService.error(
              'Error al crear paciente'
            );
          }
        });
    }
  }

  onDelete(id: number) {
    this.patientIdToDelete = id;
    this.showDeleteModal = true;
  }

  onFilter(filters: any) {
    this.currentFilters = {
      ...this.currentFilters,
      value_field: filters.value_field
    };
    this.loadPatients();
  }

  onPageChange(page: number) {
    this.page = page;
    this.loadPatients();
  }

  onTakeChange(take: number) {
    this.take = take;
    this.page = 1;
    this.loadPatients();

  }
  confirmDelete() {

    if (!this.patientIdToDelete) {
      return;
    }

    this.servicePatients
      .delete(this.patientIdToDelete)
      .subscribe({

        next: () => {
          this.alertService.success(
            'Paciente eliminado correctamente'
          );
          this.loadPatients();
          this.showDeleteModal = false;
        },

        error: () => {
          this.alertService.error(
            'Error al eliminar paciente'
          );
        }
      });
  }

}