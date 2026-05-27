import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Option } from '../../core/interface/option.interface';
import { AlertService } from '../../core/services/alert.service';

@Component({
  selector: 'app-options',
  standalone: false,
  templateUrl: './options.component.html',
  styleUrl: './options.component.css'
})
export class OptionsComponent implements OnInit {

  options: Option[] = [];
  loading = false;
  searchTerm = '';
  
  // Modal states
  showModal = false;
  modalMode: 'create' | 'edit' = 'create';
  selectedOption: Option | null = null;
  optionForm: FormGroup;
  
  // Iconos disponibles
  availableIcons = [
    'home', 'dashboard', 'tachometer-alt', 'calendar', 'calendar-check',
    'business-time', 'users', 'user-md', 'user-plus', 'user-cog',
    'stethoscope', 'heartbeat', 'heart', 'brain', 'tooth', 'eye',
    'hospital', 'ambulance', 'prescription', 'file-alt', 'file-medical',
    'chart-line', 'chart-bar', 'cog', 'cogs', 'lock', 'unlock',
    'book', 'books', 'table-list', 'id-card', 'id-badge',
    'envelope', 'phone', 'map-marker-alt', 'search', 'plus', 'edit',
    'trash-alt', 'save', 'undo-alt', 'sync', 'download', 'upload',
    'print', 'share', 'clipboard-list', 'check-circle', 'times-circle'
  ];

  constructor(
    private fb: FormBuilder,
    private alertService: AlertService
  ) {
    this.optionForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      route: ['', [Validators.required]],
      icon: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.loadOptions();
  }

  loadOptions() {
    this.loading = true;
    
    // Simular carga de API
    setTimeout(() => {
      this.options = this.getExampleData();
      this.loading = false;
    }, 500);
  }

  getExampleData(): Option[] {
    return [
      {
        id: 1,
        name: 'Dashboard',
        route: '/dashboard',
        icon: 'home',
        parent_id: null,
      },
      {
        id: 2,
        name: 'Citas Médicas',
        route: '/appointments',
        icon: 'calendar-check',
        parent_id: null,
      },
      {
        id: 3,
        name: 'Calendario',
        route: '/appointments-calendar',
        icon: 'calendar',
        parent_id: null,
      },
      {
        id: 4,
        name: 'Pacientes',
        route: '/patients',
        icon: 'users',
        parent_id: null,
      },
      {
        id: 5,
        name: 'Médicos',
        route: '/doctors',
        icon: 'user-md',
        parent_id: null,
      },
      {
        id: 6,
        name: 'Usuarios',
        route: '/users',
        icon: 'user-cog',
        parent_id: null,

      },
      {
        id: 7,
        name: 'Roles',
        route: '/roles',
        icon: 'lock',
        parent_id: null,
      },
      {
        id: 8,
        name: 'Catálogos',
        route: '/catalogs',
        icon: 'book',
        parent_id: null,
      },
      {
        id: 9,
        name: 'Especialidades',
        route: '/specialties',
        icon: 'stethoscope',
        parent_id: null,
      },
      {
        id: 10,
        name: 'Reportes',
        route: '/reports',
        icon: 'chart-line',
        parent_id: null,
      }
    ];
  }

  // Filtrar opciones por término de búsqueda
  get filteredOptions(): Option[] {
    if (!this.searchTerm) return this.options;
    return this.options.filter(opt =>
      opt.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      opt.route.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      opt.icon.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  openCreateModal() {
    this.modalMode = 'create';
    this.selectedOption = null;
    this.optionForm.reset({
      name: '',
      route: '',
      icon: ''
    });
    this.showModal = true;
  }

  openEditModal(option: Option) {
    this.modalMode = 'edit';
    this.selectedOption = option;
    this.optionForm.patchValue({
      name: option.name,
      route: option.route,
      icon: option.icon
    });
    this.showModal = true;
  }

  saveOption() {
    if (this.optionForm.invalid) {
      this.optionForm.markAllAsTouched();
      return;
    }

    const formValue = this.optionForm.value;

    if (this.modalMode === 'create') {
      // Crear nueva opción
      const newOption: Option = {
        id: Math.max(...this.options.map(o => o.id!), 0) + 1,
        name: formValue.name,
        route: formValue.route,
        icon: formValue.icon,
        parent_id: null,
      };
      
      this.options.push(newOption);
      this.alertService.success('Opción creada correctamente');
    } else if (this.selectedOption) {
      // Actualizar opción
      const index = this.options.findIndex(o => o.id === this.selectedOption!.id);
      if (index !== -1) {
        this.options[index] = {
          ...this.options[index],
          name: formValue.name,
          route: formValue.route,
          icon: formValue.icon,
        };
      }
      this.alertService.success('Opción actualizada correctamente');
    }

    this.showModal = false;
    this.loadOptions(); // Recargar para mantener consistencia
  }

  deleteOption(option: Option) {
        this.options = this.options.filter(o => o.id !== option.id);
        this.alertService.success('Opción eliminada correctamente');
  }

  getIconClass(icon: string): string {
    return `fas fa-${icon}`;
  }

  closeModal() {
    this.showModal = false;
    this.selectedOption = null;
    this.optionForm.reset();
  }

  
}