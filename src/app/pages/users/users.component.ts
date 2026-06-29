import { Component } from '@angular/core';
import { FilterField } from '../../core/interface/filter-field.interface';
import { FormField } from '../../core/interface/form-field.interface';
import { TableColumn } from '../../core/interface/table-column.interface';
import { User } from '../../core/interface/user.interface';
import { AlertService } from '../../core/services/alert.service';
import { CatalogsService } from '../../core/services/catalogs.service';
import { RoleService } from '../../core/services/role.service';
import { UsersService } from '../../core/services/users.service';

@Component({
  selector: 'app-users',
  standalone: false,
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent {

  users: User[] = [];
  selectedUsers: any = null;
  isModalOpen = false;
  loading = false;
  mode: 'create' | 'edit' | 'view' = 'create';

  columns: TableColumn[] = [
    { label: 'Usuario', field: 'user' },
    { label: 'Username', field: 'username' },
    { label: 'Rol', field: 'rol_name' },
    { label: 'Correo', field: 'email' },
    { label: 'Teléfono', field: 'phone' }
  ];

  allFormFields: FormField[] = [
    { name: 'rol_id', label: 'Rol', type: 'select', required: true, options: [] },
    { name: 'identification', label: 'Identificación', type: 'text', inputType: 'number', required: true, minLength: 10, maxLength: 10 },
    { name: 'document_type_id', label: 'Tipo Documento', type: 'select', required: true, options: [] },
    { name: 'username', label: 'Usuario', type: 'text', inputType: 'alphanumeric', required: true },
    { name: 'password', label: 'Contraseña', type: 'password', required: true },
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
    { name: 'value_field', label: 'Buscar usuario', type: 'text' }
  ];

  /* PAGINACIÓN */
  totalUsers = 0;
  page = 1;
  take = 5;
  takeOptions = [5, 10, 25, 50];

  /* DELETE MODAL */
  showDeleteModal = false;
  userIdToDelete: any = null;

  get formFields(): FormField[] {

    // CREATE
    if (this.mode === 'create') {

      return this.allFormFields.filter(field =>
        [
          'rol_id',
          'identification',
          'document_type_id',
          'first_name',
          'last_name',
          'email',
          'username',
          'password',
          'phone',
          'address',
          'birth_date',
          'gender_id',
          'nationality_id',
        ].includes(field.name)
      );
    }

    // EDIT
    if (this.mode === 'edit') {

      return this.allFormFields.filter(field =>
        [
          'first_name',
          'last_name',
          'email',
          'phone',
          'address',
          'birth_date',
          'gender_id',
          'nationality_id'
        ].includes(field.name)
      );
    }

    // VIEW
    return this.allFormFields;
  }

  constructor(
    private serviceUsers: UsersService,
    private alertService: AlertService,
    private catalogsService: CatalogsService,
    private roleService: RoleService,
  ) { }

  ngOnInit() {
    this.loadUsers();
    this.loadCatalogs();
    this.loadRols();
  }

  loadUsers() {

    this.loading = true;
    this.currentFilters.skip = this.page;
    this.currentFilters.take = this.take;

    this.serviceUsers
      .getAll(this.currentFilters)
      .subscribe({

        next: (res) => {

          this.totalUsers = res.total || 0;
          this.page = res.page || 1;
          this.take = res.limit || 5;
          this.users = res.data.map((item: any) => {

            return {
              id: item.id,
              username: item.username,
              password: item.password,
              user: `${item.persons?.first_name || ''} ${item.persons?.last_name || ''}`,
              rol_id: item.user_roles?.[0]?.role_id || null,
              rol_name: item.user_roles?.map((rol: any) => rol.roles.name).join(', ') || '',
              identification: item.persons?.identification || '',
              document_type_id: item.persons?.document_type_id || null,
              first_name: item.persons?.first_name || '',
              last_name: item.persons?.last_name || '',
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
          this.alertService.error('Error al cargar usuarios');
        }
      });
  }

  openCreate() {
    this.selectedUsers = null;
    this.isModalOpen = true;
    this.mode = 'create';
    this.loadRols();
  }

  onEdit(user: any) {
    this.selectedUsers = {
      ...user
    };
    this.isModalOpen = true;
    this.mode = 'edit';
    this.loadRols(user.rol_id);
  }

  onView(user: any) {
    this.selectedUsers = {
      ...user
    };
    this.isModalOpen = true;
    this.mode = 'view';
    this.loadRols(user.rol_id);
  }

  onSave(data: User) {

    const payload = this.selectedUsers?.id
      ? {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        birth_date: data.birth_date,
        gender_id: Number(data.gender_id),
        nationality_id: Number(data.nationality_id),
      }
      : {
        identification: data.identification,
        document_type_id: Number(data.document_type_id),
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        username: data.username,
        password: data.password,
        phone: data.phone,
        address: data.address,
        birth_date: data.birth_date,
        gender_id: Number(data.gender_id),
        nationality_id: Number(data.nationality_id),
        role_id: Number(data.rol_id),
      };

    if (this.selectedUsers?.id) {

      this.serviceUsers
        .update(this.selectedUsers.id, payload)
        .subscribe({

          next: () => {
            this.alertService.success(
              'Usuario actualizado correctamente'
            );
            this.loadUsers();
            this.isModalOpen = false;

          },

          error: () => {
            this.alertService.error(
              'Error al actualizar usuario'
            );
          }
        });

    } else {

      this.serviceUsers
        .create(payload)
        .subscribe({

          next: () => {
            this.alertService.success(
              'Usuario creado correctamente'
            );
            this.loadUsers();
            this.isModalOpen = false;
          },

          error: () => {
            this.alertService.error(
              'Error al crear usuario'
            );
          }
        });
    }
  }

  onDelete(user: any) {
    this.userIdToDelete = user;
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
    this.loadUsers();
  }

  onPageChange(page: number) {
    this.page = page;
    this.loadUsers();
  }

  onTakeChange(take: number) {
    this.take = take;
    this.page = 1;
    this.loadUsers();

  }
  confirmDelete() {

    if (!this.userIdToDelete) {
      return;
    }

    this.serviceUsers
      .delete(this.userIdToDelete)
      .subscribe({

        next: () => {
          this.alertService.success('Usuario eliminado/reactivado correctamente');
          this.loadUsers();
          this.showDeleteModal = false;
          this.userIdToDelete = null;
        },

        error: () => {
          this.alertService.error('Error al eliminar/reactivar Usuario');
        }
      });
  }

  getModalTitle(): string {
    if (!this.userIdToDelete) return '';
    const isActive = this.userIdToDelete.status === 'Activo';
    return isActive ? 'Eliminar Usuario' : 'Reactivar Usuario';
  }

  getModalMessage(): string {
    if (!this.userIdToDelete) return '';
    const isActive = this.userIdToDelete.status === 'Activo';
    const userName = this.userIdToDelete.username;

    return isActive
      ? `¿Está seguro de eliminar el Usuario "${userName}"?`
      : `¿Está seguro de reactivar el Usuario "${userName}"?`;
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

  loadRols(selectedRoleId?: number) {

    const filter = {
      skip: 1,
      take: 9999,
      status: 'A',
    };

    this.roleService.getAll(filter)
      .subscribe({

        next: (res) => {

          const field = this.formFields.find(
            f => f.name === 'rol_id'
          );

          if (field) {

            let rolesData = res.data;

            // CREATE
            if (this.mode === 'create') {

              const excludedRoles = [
                'ADMIN',
                'PACIENTE'
              ];

              rolesData = rolesData.filter(
                (item: any) => !excludedRoles.includes(item.name)
              );
            }

            // EDIT / VIEW
            else {

              rolesData = rolesData.filter((item: any) =>
                item.id === selectedRoleId
              );
            }

            field.options = rolesData.map((item: any) => ({
              label: item.name,
              value: item.id
            }));
          }
        }
      });
  }

}
