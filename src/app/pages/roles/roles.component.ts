import { Component, OnInit } from '@angular/core';
import { FormField } from '../../core/interface/form-field.interface';
import { Permission } from '../../core/interface/permission.interface';
import { ModulePermission, Role } from '../../core/interface/role.interface';
import { AlertService } from '../../core/services/alert.service';
import { PermissionsService } from '../../core/services/permissions.service';
import { RoleService } from '../../core/services/role.service';

type PermissionKey = 'read' | 'create' | 'update' | 'delete';
@Component({
  selector: 'app-roles',
  standalone: false,
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.css',
})
export class RolesComponent implements OnInit {

  roles: Role[] = [];
  loading = false;
  selectedRoleForPermissions: Role | null = null;
  permissions: Permission[] = [];
  moduleAccessCountMap: Record<number, number> = {};
  permissionMatrix: ModulePermission[] = [];

  selectedRole: any = null;
  mode: 'create' | 'edit' = 'create';
  isModalOpen = false;

  showDeleteModal = false;
  rolIdToDelete: number | null = null;

  formFields: FormField[] = [
    { name: 'name', label: 'Nombre', type: 'text', inputType: 'letters', required: true },
    { name: 'description', label: 'Descripción', type: 'text', inputType: 'letters', required: true },
  ];

  permissionColumns: {
    key: PermissionKey;
    label: string;
  }[] = [
      { key: 'read', label: 'Leer' },
      { key: 'create', label: 'Crear' },
      { key: 'update', label: 'Editar' },
      { key: 'delete', label: 'Eliminar' }
    ];

  permissionCodeMap = {
    create: 'CREATE',
    read: 'READ',
    update: 'UPDATE',
    delete: 'DELETE'
  };

  constructor(
    private roleService: RoleService,
    private permissionsService: PermissionsService,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
    this.loadRoles();
    this.loadPermissions();
  }

  loadRoles() {
    this.loading = true;

    this.roleService.getAll().subscribe({
      next: (res) => {
        this.roles = res.data.filter((role: Role) => role.name !== 'PACIENTE');
        this.loading = false;
        this.buildPermissionMatrix();
        if (this.roles.length > 0 && !this.selectedRoleForPermissions) {
          this.selectedRoleForPermissions = this.roles[0];
        }
      },
      error: (err) => {
        console.error('Error loading roles:', err);
        this.loading = false;
      }
    });
  }

  loadPermissions(): void {
    this.permissionsService.getAll().subscribe({
      next: (res) => {
        this.permissions = res.data || [];
      },
      error: (err) => {
        console.error('Error loading permissions', err);
      }

    });
  }

  getPermissionIdByCode(code: string): number | undefined {
    return this.permissions.find(
      permission => permission.code === code
    )?.id;
  }

  buildPermissionMatrix(): void {

    if (!this.roles.length) {
      this.permissionMatrix = [];
      return;
    }

    const uniqueOptionsMap = new Map<number, any>();

    this.roles.forEach(role => {
      role.options?.forEach(option => {
        if (!uniqueOptionsMap.has(option.id)) {
          uniqueOptionsMap.set(option.id, {
            id: option.id,
            name: option.name,
            icon: option.icon
          });
        }
      });
    });

    this.roles.forEach(role => {
      this.moduleAccessCountMap[role.id] =
        this.permissionMatrix.filter(
          module => module.permissions[role.id]?.read
        ).length;
    });

    const uniqueOptions = Array.from(uniqueOptionsMap.values());

    this.permissionMatrix = uniqueOptions.map(option => {
      const modulePermissions: ModulePermission = {
        moduleId: option.id,
        moduleName: option.name,
        icon: option.icon,
        permissions: {}
      };

      this.roles.forEach(role => {

        const roleOption = role.options?.find(
          opt => opt.id === option.id
        );

        modulePermissions.permissions[role.id] = {
          read:
            roleOption?.permissions?.some(
              p => p.code === 'READ'
            ) || false,
          create:
            roleOption?.permissions?.some(
              p => p.code === 'CREATE'
            ) || false,
          update:
            roleOption?.permissions?.some(
              p => p.code === 'UPDATE'
            ) || false,
          delete:
            roleOption?.permissions?.some(
              p => p.code === 'DELETE'
            ) || false,
        };
      });

      return modulePermissions;
    });

    this.moduleAccessCountMap = {};

    this.roles.forEach(role => {

      this.moduleAccessCountMap[role.id] =
        this.permissionMatrix.filter(
          module => module.permissions[role.id]?.read
        ).length;

    });
  }

  selectRoleForPermissions(role: Role) {
    this.selectedRoleForPermissions = role;
  }

  togglePermissionForSelectedRole(
    module: ModulePermission,
    permissionType: PermissionKey
  ): void {

    if (!this.selectedRoleForPermissions) {
      return;
    }

    const roleId = this.selectedRoleForPermissions.id;

    if (!module.permissions[roleId]) {

      module.permissions[roleId] = {
        read: false,
        create: false,
        update: false,
        delete: false
      };

    }

    // Toggle local
    const rolePermissions = module.permissions[roleId];
    rolePermissions[permissionType as keyof typeof rolePermissions] =
      !rolePermissions[permissionType as keyof typeof rolePermissions];

    const permissions = Object.entries(this.permissionCodeMap)
      .filter(([key]) => module.permissions[roleId][key as keyof typeof module.permissions[typeof roleId]])
      .map(([, code]) => this.getPermissionIdByCode(code))
      .filter((id): id is number => !!id);

    const payload = {
      role_id: roleId,
      option_id: module.moduleId,
      permissions
    };

    this.permissionsService
      .update(payload)
      .subscribe({
        error: () => {
          this.alertService.error(
            'Error al actualizar permisos'
          );
        }
      });

  }

  trackByRole(index: number, role: Role): number {
    return role.id;
  }

  trackByModule(index: number, module: ModulePermission): number {
    return module.moduleId;
  }

  trackByPermission(
    index: number,
    permission: { key: PermissionKey }
  ): PermissionKey {
    return permission.key;
  }

  openCreate() {
    this.selectedRole = null;
    this.isModalOpen = true;
    this.mode = 'create';
  }

  onEdit(rol: any) {
    this.selectedRole = {
      ...rol
    };
    this.isModalOpen = true;
    this.mode = 'edit';
  }

  onSave(data: Role) {

    const payload = {
      name: data.name,
      description: data.description
    };

    if (this.selectedRole?.id) {

      this.roleService
        .update(this.selectedRole.id, payload)
        .subscribe({

          next: () => {
            this.alertService.success(
              'Rol actualizado correctamente'
            );
            this.loadRoles();
            this.isModalOpen = false;

          },

          error: () => {
            this.alertService.error(
              'Error al actualizar Rol'
            );
          }
        });

    } else {

      this.roleService
        .create(payload)
        .subscribe({

          next: () => {
            this.alertService.success(
              'Rol creado correctamente'
            );
            this.loadRoles();
            this.isModalOpen = false;
          },

          error: () => {
            this.alertService.error(
              'Error al crear Rol'
            );
          }
        });
    }
  }

  onDelete(id: number) {
    this.rolIdToDelete = id;
    this.showDeleteModal = true;
  }

  confirmDelete() {

    if (!this.rolIdToDelete) {
      return;
    }

    this.roleService
      .delete(this.rolIdToDelete)
      .subscribe({

        next: () => {
          this.alertService.success(
            'Rol eliminado correctamente'
          );
          this.loadRoles();
          this.showDeleteModal = false;
        },

        error: () => {
          this.alertService.error(
            'Error al eliminar Rol'
          );
        }
      });
  }


}