import { Component } from '@angular/core';
import { Doctor } from '../../core/interface/doctor.interface';
import { FilterField } from '../../core/interface/filter-field.interface';
import { FormField } from '../../core/interface/form-field.interface';
import { TableColumn } from '../../core/interface/table-column.interface';
import { User } from '../../core/interface/user.interface';
import { AlertService } from '../../core/services/alert.service';
import { CatalogsService } from '../../core/services/catalogs.service';
import { DoctorService } from '../../core/services/doctor.service';
import { UsersService } from '../../core/services/users.service';

@Component({
  selector: 'app-doctors',
  standalone: false,
  templateUrl: './doctors.component.html',
  styleUrl: './doctors.component.css'
})
export class DoctorsComponent {

  doctors: Doctor[] = [];
  selectedDoctors: any = null;
  isModalOpen = false;
  loading = false;
  mode: 'create' | 'edit' | 'view' = 'create';

  columns: TableColumn[] = [
    { label: 'Identificación', field: 'identification' },
    { label: 'Doctor', field: 'doctor' },
    { label: 'Teléfono', field: 'phone' },
    { label: 'Correo', field: 'email' },
    { label: 'Dirección', field: 'address' }
  ];

  formFields: FormField[] = [
    { name: 'identification', label: 'Identificación', type: 'text', inputType: 'number', required: true, minLength: 10, maxLength: 10, disableOnEdit: true },
    { name: 'document_type_id', label: 'Tipo Documento', type: 'select', required: true, options: [], disableOnEdit: true },
    { name: 'license_number', label: 'Numero de Licencia', type: 'text', inputType: 'alphanumeric', required: true },
    { name: 'first_name', label: 'Nombres', type: 'text', inputType: 'letters', required: true },
    { name: 'last_name', label: 'Apellidos', type: 'text', inputType: 'letters', required: true },
    { name: 'phone', label: 'Teléfono', type: 'text', inputType: 'number', required: true, minLength: 10, maxLength: 10 },
    { name: 'email', label: 'Correo', type: 'text', inputType: 'email', required: true },
    { name: 'address', label: 'Dirección', type: 'text', inputType: 'alphanumeric', required: true },
    { name: 'birth_date', label: 'Fecha de Nacimiento', type: 'date', required: true },
    { name: 'gender_id', label: 'Género', type: 'select', required: true, options: [] },
    { name: 'nationality_id', label: 'Nacionalidad', type: 'select', required: true, options: [] },
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
    { name: 'value_field', label: 'Buscar doctor', type: 'text' }
  ];

  /* PAGINACIÓN */
  totalDoctors = 0;
  page = 1;
  take = 5;
  takeOptions = [5, 10, 25, 50];

  /* DELETE MODAL */
  showDeleteModal = false;
  doctorIdToDelete: any = null;

  constructor(
    private serviceDoctors: DoctorService,
    private serviceUsers: UsersService,
    private alertService: AlertService,
    private catalogsService: CatalogsService
  ) { }

  ngOnInit() {
    this.loadDoctors();
    this.loadCatalogs();
  }

  loadDoctors() {

    this.loading = true;
    this.currentFilters.skip = this.page;
    this.currentFilters.take = this.take;

    this.serviceDoctors
      .getAll(this.currentFilters)
      .subscribe({

        next: (res) => {

          this.totalDoctors = res.total || 0;
          this.page = res.page || 1;
          this.take = res.limit || 5;
          this.doctors = res.data.map((item: any) => {

            return {
              id: item.id,
              license_number: item.license_number || '',
              identification: item.persons?.identification || '',
              document_type_id: item.persons?.document_type_id || null,
              first_name: item.persons?.first_name || '',
              last_name: item.persons?.last_name || '',
              doctor: `${item.persons?.first_name || ''} ${item.persons?.last_name || ''}`,
              phone: item.persons?.phone || '',
              email: item.persons?.email || '',
              address: item.persons?.address || '',
              gender_id: item.persons?.gender_id || null,
              nationality_id: item.persons?.nationality_id || null,
              birth_date: item.persons?.birth_date ? item.persons.birth_date.split('T')[0] : '',
              status: !item.deleted_at ? 'Activo' : 'Inactivo',
              userId: item.persons?.users[0].id || null
            };
          });
          this.loading = false;
        },

        error: () => {
          this.loading = false;
          this.alertService.error(
            'Error al cargar doctores'
          );
        }
      });
  }

  onEdit(doctor: any) {
    this.selectedDoctors = {
      ...doctor
    };
    this.isModalOpen = true;
    this.mode = 'edit';
  }

  onView(doctor: any) {
    this.selectedDoctors = {
      ...doctor
    };
    this.isModalOpen = true;
    this.mode = 'view';
  }

  onDelete(doctor: number) {
    this.doctorIdToDelete = doctor;
    this.showDeleteModal = true;
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
    this.loadDoctors();
  }

  onPageChange(page: number) {
    this.page = page;
    this.loadDoctors();
  }

  onTakeChange(take: number) {
    this.take = take;
    this.page = 1;
    this.loadDoctors();

  }
  confirmDelete() {

    if (!this.doctorIdToDelete) {
      return;
    }

    this.serviceDoctors
      .delete(this.doctorIdToDelete.id)
      .subscribe({

        next: () => {
          this.alertService.success('Doctor eliminado/reactivado correctamente');
          this.loadDoctors();
          this.showDeleteModal = false;
          this.doctorIdToDelete = null;
        },

        error: () => {
          this.alertService.error('Error al eliminar/reactivar doctor');
        }
      });
  }

  getModalTitle(): string {
    if (!this.doctorIdToDelete) return '';
    const isActive = this.doctorIdToDelete.status === 'Activo';
    return isActive ? 'Eliminar Doctor' : 'Reactivar Doctor';
  }

  getModalMessage(): string {
    if (!this.doctorIdToDelete) return '';
    const isActive = this.doctorIdToDelete.status === 'Activo';
    const doctorName = this.doctorIdToDelete.identification;

    return isActive
      ? `¿Está seguro de eliminar el Doctor "${doctorName}"?`
      : `¿Está seguro de reactivar el Doctor "${doctorName}"?`;
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

  onSave(data: User) {

    const payload =  {
        identification: data.identification,
        license_number: data.license_number,
        document_type_id: Number(data.document_type_id),
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        birth_date: data.birth_date,
        gender_id: Number(data.gender_id),
        nationality_id: Number(data.nationality_id),
      };
      console.log("this.selectedDoctors: ", this.selectedDoctors);
      
      this.serviceUsers
        .update(this.selectedDoctors.userId, payload)
        .subscribe({

          next: () => {
            this.alertService.success('Doctor actualizado correctamente');
            this.loadDoctors();
            this.isModalOpen = false;
          },

          error: () => {
            this.alertService.error('Error al actualizar Doctor');
          }
        });
    
  }

}

