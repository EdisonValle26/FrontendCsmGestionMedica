import { Component, OnInit } from '@angular/core';
import { CatalogsType } from '../../core/interface/catalog-type.interface';
import { Catalogs } from '../../core/interface/catalog.interface';
import { FormField } from '../../core/interface/form-field.interface';
import { AlertService } from '../../core/services/alert.service';
import { CatalogsTypeService } from '../../core/services/catalogs-type.service';
import { CatalogsService } from '../../core/services/catalogs.service';

@Component({
  selector: 'app-catalogs',
  standalone: false,
  templateUrl: './catalogs.component.html',
  styleUrl: './catalogs.component.css'
})
export class CatalogsComponent implements OnInit {

  catalogsType: CatalogsType[] = [];
  selectedItem: any = null;

  showItemModal = false;
  selectedCatalog: any | null = null;
  showCatalogTypeModal = false;
  selectedCatalogType: any = null;

  mode: 'create' | 'edit' = 'create';
  loading = false;

  isModalOpen = false;

  formFields: FormField[] = [
    { name: 'code', label: 'Código', type: 'text', inputType: 'letters', required: true, disableOnEdit: true },
    { name: 'name', label: 'Nombre', type: 'text', inputType: 'letters', required: true }
  ];

  catalogItemFields: FormField[] = [
    { name: 'code', label: 'Código', type: 'text', inputType: 'alphanumeric', required: true },
    { name: 'value', label: 'Valor', type: 'text', inputType: 'alphanumeric', required: true },
    { name: 'description', label: 'Descripción', type: 'textarea', inputType: 'alphanumeric', required: false }
  ];

  /* DELETE MODAL */
  showDeleteModal = false;
  catalogIdToDelete: any = null;

  constructor(
    private alertService: AlertService,
    private catalogsService: CatalogsService,
    private catalogsTypeService: CatalogsTypeService
  ) { }

  ngOnInit() {
    this.loadCatalogs();
  }

  loadCatalogs() {

    this.loading = true;

    const filters = {
      skip: 1,
      take: 9999
    };

    this.catalogsTypeService
      .getAll(filters)
      .subscribe({

        next: (res) => {

          this.catalogsType = res.data.map((item: any) => ({
            id: item.id,
            code: item.code,
            name: item.name,
            totalItems: item._count.catalogs,
            items: item.catalogs.map((catalog: Catalogs) => ({
              id: catalog.id,
              type_id: catalog.type_id,
              code: catalog.code,
              value: catalog.value,
              description: catalog.description,
              status: !catalog.deleted_at ? 'Activo' : 'Inactivo'
            })),
          }));

          this.loading = false;
        },

        error: () => {
          this.loading = false;
          this.alertService.error('Error al cargar catálogos');
        }
      });

  }

  openCreate() {
    this.selectedCatalogType = null;
    this.mode = 'create';
    this.showCatalogTypeModal = true;
  }

  onEdit(catalogType: any) {
    this.selectedCatalogType = {
      ...catalogType
    };

    this.mode = 'edit';
    this.showCatalogTypeModal = true;
  }

  onSaveCatalogType(data: any) {

    const payload = {
      code: data.code,
      name: data.name
    };

    // EDIT
    if (this.selectedCatalogType?.id) {
      this.catalogsTypeService
        .update(this.selectedCatalogType.id, payload)
        .subscribe({

          next: () => {
            this.alertService.success('Catálogo actualizado correctamente');
            this.loadCatalogs();
            this.showCatalogTypeModal = false;
          },

          error: () => {
            this.alertService.error('Error al actualizar catálogo');
          }
        });

      return;
    }

    // CREATE
    this.catalogsTypeService
      .create(payload)
      .subscribe({

        next: () => {
          this.alertService.success('Catálogo creado correctamente');
          this.loadCatalogs();
          this.showCatalogTypeModal = false;
        },

        error: () => {
          this.alertService.error('Error al crear catálogo');
        }
      });
  }

  openCreateItem(catalog: any) {

    this.selectedCatalog = catalog;
    this.selectedItem = {
      type_id: catalog.id
    };

    this.mode = 'create';
    this.showItemModal = true;
  }

  onEditItem(catalog: any, item: any) {

    this.selectedCatalog = catalog;

    this.selectedItem = {
      ...item
    };

    this.mode = 'edit';
    this.showItemModal = true;
  }

  onSaveItem(data: any) {

    const payload = {
      type_id: this.selectedCatalog.id,
      code: data.code,
      value: data.value,
      description: data.description
    };

    // UPDATE
    if (this.selectedItem?.id) {

      this.catalogsService
        .update(this.selectedItem.id, payload)
        .subscribe({

          next: () => {
            this.alertService.success('Catálogo actualizado correctamente');
            this.loadCatalogs();
            this.showItemModal = false;
          },

          error: () => {
            this.alertService.error('Error al actualizar catálogo');
          }
        });

      return;

    }

    // CREATE
    this.catalogsService
      .create(payload)
      .subscribe({

        next: () => {
          this.alertService.success('Catálogo creado correctamente');
          this.loadCatalogs();
          this.showItemModal = false;
        },

        error: () => {
          this.alertService.error('Error al crear catálogo');
        }
      });

  }

  onDeleteItem(catalog: any, item: any) {
    this.catalogIdToDelete = item;
    this.showDeleteModal = true;
  }

  confirmDelete() {
    if (!this.catalogIdToDelete) {
      return;
    }

    this.catalogsService
      .delete(this.catalogIdToDelete.id)
      .subscribe({

        next: () => {
          this.alertService.success('Catálogo eliminado/reactivado correctamente');
          this.loadCatalogs();
          this.showDeleteModal = false;
          this.catalogIdToDelete = null;
        },

        error: () => {
          this.alertService.error('Error al eliminar/reactivar catálogo');
        }
      });
  }

  getModalTitle(): string {

    if (!this.catalogIdToDelete) {
      return '';
    }

    const isActive = this.catalogIdToDelete.status === 'Activo';
    return isActive ? 'Eliminar catálogo' : 'Reactivar catálogo';
  }

  getModalMessage(): string {

    if (!this.catalogIdToDelete) {
      return '';
    }

    const isActive = this.catalogIdToDelete.status === 'Activo';
    const catalogName = this.catalogIdToDelete.value;

    return isActive
      ? `¿Está seguro de eliminar el catálogo "${catalogName}"?`
      : `¿Está seguro de reactivar el catálogo "${catalogName}"?`;
  }


}