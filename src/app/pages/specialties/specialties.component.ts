import { Component, OnInit } from '@angular/core';
import { FormField } from '../../core/interface/form-field.interface';
import { Specialities } from '../../core/interface/specialties.interface';
import { AlertService } from '../../core/services/alert.service';
import { SpecialtyService } from '../../core/services/specialty.service';

@Component({
  selector: 'app-specialties',
  standalone: false,
  templateUrl: './specialties.component.html',
  styleUrl: './specialties.component.css'
})
export class SpecialtiesComponent implements OnInit {

  specialties: Specialities[] = [];
  selectedSpecialty: any = null;
  isModalOpen = false;
  loading = false;
  mode: 'create' | 'edit' | 'view' = 'create';

  icons = [
    'heart',
    'brain',
    'stethoscope',
    'user-doctor',
    'tooth',
    'eye',
    'smile',
    'bone',
    'lungs',
    'baby',
    'notes-medical',
    'hand-holding-heart',
    'ear-listen',
    'user-nurse',
    'hospital-user',
    'pills',
    'syringe',
    'female'
  ];

  formFields: FormField[] = [
    { name: 'name', label: 'Nombre', type: 'text', inputType: 'letters', required: true },
    { name: 'description', label: 'Descripción', type: 'textarea', required: true },
    { name: 'icon', label: 'Icono', type: 'select', required: true, options: [] }
  ];

  /* DELETE MODAL */
  showDeleteModal = false;
  specialtyIdToDelete: any = null;

  constructor(
    private specialtyService: SpecialtyService,
    private alertService: AlertService,
  ) { }

  ngOnInit(): void {
    this.loadSpecialties();
    this.loadIcons();
  }

  loadIcons() {

    const field = this.formFields.find(
      f => f.name === 'icon'
    );

    if (field) {

      field.options = this.icons.map(icon => ({
        label: icon,
        value: icon
      }));
    }
  }

  loadSpecialties() {
    this.loading = true;

    const filters = {
      skip: 1,
      take: 9999,
    };

    this.specialtyService.getAll(filters).subscribe({
      next: (res) => {
        this.specialties = res.data.map((item: any) => ({
          id: item.id,
          name: item.name,
          description: item.description,
          icon: item.icon,
          color: item.color,

          status: !item.deleted_at
            ? 'Activo'
            : 'Inactivo',

          statusClass: !item.deleted_at
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800',
        }));
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando especialidades:', err);
        this.loading = false;
      }
    });
  }

  openCreate() {
    this.selectedSpecialty = null;
    this.isModalOpen = true;
    this.mode = 'create';
  }

  onEdit(specialty: any) {
    this.selectedSpecialty = {
      ...specialty
    };
    this.isModalOpen = true;
    this.mode = 'edit';
  }

  onSave(data: Specialities) {

    const payload = {
        name: data.name,
        description: data.description,
        icon: data.icon,
      }

    if (this.selectedSpecialty?.id) {

      this.specialtyService
        .update(this.selectedSpecialty.id, payload)
        .subscribe({

          next: () => {
            this.alertService.success(
              'Especialidad actualizada correctamente'
            );
            this.loadSpecialties();
            this.isModalOpen = false;

          },

          error: () => {
            this.alertService.error(
              'Error al actualizar especialidad'
            );
          }
        });

    } else {

      this.specialtyService
        .create(payload)
        .subscribe({

          next: () => {
            this.alertService.success(
              'Especialidad creada correctamente'
            );
            this.loadSpecialties();
            this.isModalOpen = false;
          },

          error: () => {
            this.alertService.error(
              'Error al crear especialidad'
            );
          }
        });
    }
  }

  onDelete(specialty: any) {
    this.specialtyIdToDelete = specialty;
    this.showDeleteModal = true;
  }

  confirmAction() {
    if (!this.specialtyIdToDelete) {
      return;
    }

    this.specialtyService.delete(this.specialtyIdToDelete.id).subscribe({
      next: () => {
        this.alertService.success(`Especialidad eliminada/reactivada correctamente`);
        this.loadSpecialties();
        this.showDeleteModal = false;
        this.specialtyIdToDelete = null;
      },
      error: () => {
        this.alertService.error('Error al eliminada/reactivada especialidad');
      }
    });

  }

  getModalTitle(): string {
    if (!this.specialtyIdToDelete) return '';
    const isActive = this.specialtyIdToDelete.status === 'Activo';
    return isActive ? 'Eliminar especialidad' : 'Reactivar especialidad';
  }

  getModalMessage(): string {
    if (!this.specialtyIdToDelete) return '';
    const isActive = this.specialtyIdToDelete.status === 'Activo';
    const specialtyName = this.specialtyIdToDelete.name;

    return isActive
      ? `¿Está seguro de eliminar la especialidad "${specialtyName}"?`
      : `¿Está seguro de reactivar la especialidad "${specialtyName}"?`;
  }

}