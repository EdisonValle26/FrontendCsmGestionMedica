import { Component } from '@angular/core';
import { FilterField } from '../../core/interface/filter-field.interface';
import { FormField } from '../../core/interface/form-field.interface';
import { Patient } from '../../core/interface/patient.interface';
import { TableColumn } from '../../core/interface/table-column.interface';
import { AlertService } from '../../core/services/alert.service';
import { CatalogsService } from '../../core/services/catalogs.service';
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
  mode: 'create' | 'edit' | 'view' = 'create';

  columns: TableColumn[] = [
    { label: 'Identificación', field: 'identification' },
    { label: 'Paciente', field: 'patient' },
    { label: 'Teléfono', field: 'phone' },
    { label: 'Correo', field: 'email' },
    { label: 'Dirección', field: 'address' }
  ];

  formFields: FormField[] = [
    { name: 'document_type_id', label: 'Tipo Documento', type: 'select', required: true, options: [] },
    { name: 'identification', label: 'Identificación', type: 'text', inputType: 'number', required: true, minLength: 10, maxLength: 10 },
    { name: 'first_name', label: 'Nombres', type: 'text', inputType: 'letters', required: true },
    { name: 'last_name', label: 'Apellidos', type: 'text', inputType: 'letters', required: true },
    { name: 'phone', label: 'Teléfono', type: 'text', inputType: 'number', required: true, minLength: 10, maxLength: 10 },
    { name: 'email', label: 'Correo', type: 'text', inputType: 'email' },
    { name: 'address', label: 'Dirección', type: 'text', inputType: 'alphanumeric' },
    { name: 'nationality_id', label: 'Nacionalidad', type: 'select', required: true, options: [] },
    { name: 'birth_date', label: 'Fecha de Nacimiento', type: 'date' },
    { name: 'gender_id', label: 'Género', type: 'select', options: [] },
  ];

  currentFilters: any = {
    skip: 1,
    take: 5,
    status: 'A',
    field: ['first_name', 'last_name', 'identification', 'email', 'phone', 'address']
  };

  filtersConfig: FilterField[] = [
    {
      name: 'status', label: 'Estado', type: 'select', width: 'w-48', defaultValue: this.currentFilters.status,
      options: [
        { label: 'Todos', value: 'ALL' },
        { label: 'Activos', value: 'A' },
        { label: 'Inactivos', value: 'I' }
      ]
    },
    { name: 'value_field', label: 'Buscar paciente', type: 'text' },
  ];

  /* PAGINACIÓN */
  totalPatients = 0;
  page = 1;
  take = 5;
  takeOptions = [5, 10, 25, 50];

  /* DELETE MODAL */
  showDeleteModal = false;
  patientIdToDelete: any = null;

  constructor(
    private servicePatients: PatientsService,
    private alertService: AlertService,
    private catalogsService: CatalogsService
  ) { }

  ngOnInit() {
    this.loadPatients();
    this.loadCatalogs();
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
              document_type_id: item.persons?.document_type_id || null,
              first_name: item.persons?.first_name || '',
              last_name: item.persons?.last_name || '',
              patient: `${item.persons?.first_name || ''} ${item.persons?.last_name || ''}`,
              phone: item.persons?.phone || '',
              email: item.persons?.email || '',
              address: item.persons?.address || '',
              gender_id: item.persons?.gender_id || null,
              nationality_id: item.persons?.nationality_id || null,
              birth_date: item.persons?.birth_date ? item.persons.birth_date.split('T')[0] : '',
              status: !item.deleted_at ? 'Activo' : 'Inactivo',
            };
          });
          this.loading = false;
        },

        error: () => {
          this.loading = false;
          this.alertService.error('Error al cargar pacientes');
        }
      });
  }

  openCreate() {
    this.selectedPatients = null;
    this.isModalOpen = true;
    this.mode = 'create';
  }

  onEdit(patient: any) {
    this.selectedPatients = {
      ...patient
    };
    this.isModalOpen = true;
    this.mode = 'edit';
  }

  onView(patient: any) {
    this.selectedPatients = {
      ...patient
    };
    this.isModalOpen = true;
    this.mode = 'view';
  }

  onSave(data: Patient) {

    const payload = {
      identification: data.identification,
      document_type_id: Number(data.document_type_id),
      first_name: data.first_name,
      last_name: data.last_name,
      birth_date: data.birth_date,
      gender_id: Number(data.gender_id),
      nationality_id: Number(data.nationality_id),
      phone: data.phone,
      email: data.email,
      address: data.address,
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

  onFilter(filters: any) {

    this.currentFilters = {
      ...this.currentFilters,
      value_field: filters.value_field || '',
    };

    if (filters.status === 'ALL') {
      delete this.currentFilters.status;
    } else {
      this.currentFilters.status = filters.status;
    }

    this.filtersConfig = this.filtersConfig.map(f => {

      if (f.name === 'status') {
        return {
          ...f,
          value: filters.status
        };
      }

      return f;
    });

    this.page = 1;
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

  onDelete(patient: any) {
    this.patientIdToDelete = patient;
    this.showDeleteModal = true;
  }

  confirmDelete() {

    if (!this.patientIdToDelete) {
      return;
    }

    this.servicePatients
      .delete(this.patientIdToDelete.id)
      .subscribe({

        next: () => {
          this.alertService.success('Paciente eliminado/reactivado correctamente');
          this.loadPatients();
          this.showDeleteModal = false;
          this.patientIdToDelete = null;
        },

        error: () => {
          this.alertService.error('Error al eliminar/reactivar paciente');
        }
      });
  }

  getModalTitle(): string {
    if (!this.patientIdToDelete) return '';
    const isActive = this.patientIdToDelete.status === 'Activo';
    return isActive ? 'Eliminar paciente' : 'Reactivar paciente';
  }

  getModalMessage(): string {
    if (!this.patientIdToDelete) return '';
    const isActive = this.patientIdToDelete.status === 'Activo';
    const patientName = this.patientIdToDelete.identification;

    return isActive
      ? `¿Está seguro de eliminar el paciente "${patientName}"?`
      : `¿Está seguro de reactivar el paciente "${patientName}"?`;
  }

  loadCatalogs() {

    // DOCUMENT TYPE
    this.catalogsService.getByType('DOCUMENT_TYPE').subscribe({
      next: (res) => {

        const field = this.formFields.find(
          f => f.name === 'document_type_id'
        );

        if (field) {
          field.options = res.map((item: any) => (
            { label: item.value, value: item.id }
          ));
        }
      }
    });

    // GENDER
    this.catalogsService.getByType('GENDER').subscribe({
      next: (res) => {

        const field = this.formFields.find(
          f => f.name === 'gender_id'
        );

        if (field) {
          field.options = res.map((item: any) => (
            { label: item.value, value: item.id }
          ));
        }
      }
    });

    // NATIONALITY
    this.catalogsService.getByType('NATIONALITY').subscribe({
      next: (res) => {

        const field = this.formFields.find(
          f => f.name === 'nationality_id'
        );

        if (field) {
          field.options = res.map((item: any) => (
            { label: item.value, value: item.id }
          ));
        }
      }
    });
  }

}