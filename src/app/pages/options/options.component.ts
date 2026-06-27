import { Component, OnInit } from '@angular/core';

import { FormField } from '../../core/interface/form-field.interface';
import { Option } from '../../core/interface/option.interface';

import { AlertService } from '../../core/services/alert.service';
import { OptionsService } from '../../core/services/option.service';

@Component({
  selector: 'app-options',
  standalone: false,
  templateUrl: './options.component.html',
  styleUrl: './options.component.css',
})
export class OptionsComponent implements OnInit {

  options: Option[] = [];
  loading = false;
  searchTerm = '';
  selectedOption: Option | null = null;
  mode: 'create' | 'edit' = 'create';
  isModalOpen = false;
  showDeleteModal = false;
  optionIdToDelete: number | null = null;

  formFields: FormField[] = [
    { name: 'name', label: 'Nombre', type: 'text', required: true },
    { name: 'route', label: 'Ruta', type: 'text', required: true, disableOnEdit: true },
    { name: 'icon', label: 'Icono', type: 'select', required: true, options: [] }
  ];

  icons = [
    'home',
    'business-time',
    'calendar',
    'calendar-days',
    'hospital-user',
    'file-waveform',
    'user-doctor',
    'stethoscope',
    'users',
    'user-shield',
    'folder-open',
    'table-list',
    'user-nurse',
    'hospital-user',
    'pills',
    'syringe',
    'female'
  ];

  get filteredOptions(): Option[] {

    if (!this.searchTerm.trim()) {
      return this.options;
    }

    const term = this.searchTerm.toLowerCase();

    return this.options.filter(option =>
      option.name.toLowerCase().includes(term) ||
      option.route.toLowerCase().includes(term) ||
      option.icon.toLowerCase().includes(term)
    );
  }

  constructor(
    private optionsService: OptionsService,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
    this.loadOptions();
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


  loadOptions(): void {

    this.loading = true;

    this.optionsService
      .getAll()
      .subscribe({
        next: (res) => {
          this.options = res.data.map((item: any) => ({
            id: item.id,
            name: item.name,
            route: item.route,
            icon: item.icon,
          }));
          this.loading = false;
        },

        error: () => {
          this.loading = false;
          this.alertService.error('Error al cargar opciones');
        }
      });

  }

  openCreate(): void {
    this.selectedOption = null;
    this.mode = 'create';
    this.isModalOpen = true;
  }

  onEdit(option: Option): void {
    this.selectedOption = {
      ...option
    };

    this.mode = 'edit';
    this.isModalOpen = true;

  }

  onSave(data: Option): void {

    const payload = {
      name: data.name,
      route: data.route,
      icon: data.icon
    };

    if (this.selectedOption?.id) {

      this.optionsService
        .update(this.selectedOption.id, payload)
        .subscribe({

          next: () => {
            this.alertService.success('Opción actualizada correctamente');
            this.loadOptions();
            this.isModalOpen = false;
          },

          error: () => {
            this.alertService.error('Error al actualizar opción');
          }
        });

      return;
    }

    this.optionsService
      .create(payload)
      .subscribe({

        next: () => {
          this.alertService.success('Opción creada correctamente');
          this.loadOptions();
          this.isModalOpen = false;
        },

        error: () => {
          this.alertService.error('Error al crear opción');
        }
      });
  }

  onDelete(id: number): void {
    this.optionIdToDelete = id;
    this.showDeleteModal = true;
  }

  confirmDelete(): void {

    if (!this.optionIdToDelete) {
      return;
    }

    this.optionsService
      .delete(this.optionIdToDelete)
      .subscribe({

        next: () => {
          this.alertService.success('Opción eliminada correctamente');
          this.loadOptions();
          this.showDeleteModal = false;
        },

        error: () => {
          this.alertService.error('Error al eliminar opción');
        }
      });
  }

}
