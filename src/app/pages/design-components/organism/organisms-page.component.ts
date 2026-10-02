import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BadgeComponent, ButtonComponent, InputComponent } from '../../../shared/components/atomics';
import { AccordionItemComponent } from '../../../shared/components/molecules';
import {
  AccordionComponent,
  ConfirmModalComponent,
  DataTableComponent,
  DrawerComponent,
  FileUploadComponent,
  MenuComponent,
  MenuItem,
  ModalComponent,
  NotificationModalComponent,
  SortEvent,
  TableColumn,
  ToastService
} from '../../../shared/components/organism';

@Component({
  selector: 'app-organisms-page',
  standalone: true,
  imports: [
    CommonModule,
    BadgeComponent,
    ButtonComponent,
    InputComponent,
    MenuComponent,
    AccordionComponent,
    AccordionItemComponent,
    ModalComponent,
    ConfirmModalComponent,
    NotificationModalComponent,
    DataTableComponent,
    DrawerComponent,
    FileUploadComponent
  ],
  templateUrl: './organisms-page.component.html'
})
export class OrganismsPageComponent {
  readonly toastService = inject(ToastService);

  lastMenuAction = 'Ninguna acción aún';

  // Estados de Modales
  isBaseModalOpen = false;
  isConfirmModalOpen = false;
  isConfirmLoading = false;
  isNotificationModalOpen = false;
  notificationType: 'success' | 'info' | 'warning' | 'error' = 'success';
  lastModalResult = 'Sin acciones recientes de modal';

  // Estado de Drawer
  isDrawerOpen = false;

  // Estado de Acordeón
  accordionModeActive = true;

  // Estado de Archivos
  uploadedFilesCount = 0;

  // Datos para DataTable
  tableColumns: TableColumn[] = [
    { key: 'name', header: 'Usuario', sortable: true },
    { key: 'role', header: 'Rol Asignado', sortable: true },
    { key: 'email', header: 'Correo Electrónico' },
    {
      key: 'status',
      header: 'Estado',
      isBadge: true,
      badgeVariant: (val) => (val === 'Activo' ? 'success' : val === 'Pendiente' ? 'warning' : 'neutral')
    }
  ];

  sampleUsers = [
    { id: 1, name: 'Juan Miguel', role: 'Superadmin', email: 'juan.miguel@empresa.com', status: 'Activo' },
    { id: 2, name: 'Carolina Gómez', role: 'Editor de Contenido', email: 'carolina.g@empresa.com', status: 'Activo' },
    { id: 3, name: 'Andrés Felipe', role: 'Auditor Externo', email: 'andres.f@empresa.com', status: 'Inactivo' },
    { id: 4, name: 'Valentina Restrepo', role: 'Consultora', email: 'valentina.r@empresa.com', status: 'Pendiente' }
  ];

  selectedTableUsers: any[] = [];

  // Menú de demostración interactiva
  demoMenuItems: MenuItem[] = [
    { label: 'Inicio', icon: 'dashboard', route: '/' },
    {
      label: 'Módulos Comerciales',
      icon: 'cube',
      badge: 'Nuevo',
      children: [
        { label: 'Facturación Electrónica', route: '/facturacion', icon: 'code' },
        { label: 'Inventario y Almacén', route: '/inventario', icon: 'database' },
        { label: 'Reportes y Analítica', route: '/reportes', icon: 'palette' }
      ]
    },
    {
      label: 'Seguridad y Permisos',
      icon: 'settings',
      children: [
        { label: 'Usuarios y Roles', route: '/seguridad/usuarios' },
        { label: 'Auditoría del Sistema', route: '/seguridad/auditoria' }
      ]
    }
  ];

  handleDemoMenuClick(item: MenuItem): void {
    this.lastMenuAction = `Item seleccionado: ${item.label} (Ruta: ${item.route || 'Submenú'})`;
  }

  openConfirmModal(): void {
    this.isConfirmModalOpen = true;
  }

  handleConfirmAction(): void {
    this.isConfirmLoading = true;
    setTimeout(() => {
      this.isConfirmLoading = false;
      this.isConfirmModalOpen = false;
      this.lastModalResult = 'Elemento eliminado con éxito mediante ConfirmModal.';
      this.toastService.success('Elemento eliminado', 'La operación finalizó con éxito.');
    }, 1200);
  }

  handleCancelAction(): void {
    this.lastModalResult = 'Acción cancelada por el usuario.';
  }

  openNotification(type: 'success' | 'info' | 'warning' | 'error'): void {
    this.notificationType = type;
    this.isNotificationModalOpen = true;
  }

  triggerToast(type: 'success' | 'error' | 'warning' | 'info'): void {
    switch (type) {
      case 'success':
        this.toastService.success('Operación Completada', 'Los cambios han sido guardados en el servidor.');
        break;
      case 'error':
        this.toastService.error('Error del Sistema', 'No fue posible conectar con el microfrontend remoto.');
        break;
      case 'warning':
        this.toastService.warning('Advertencia', 'Por favor verifica la conexión a Internet.');
        break;
      case 'info':
        this.toastService.info('Información', 'Nueva sincronización programada para medianoche.');
        break;
    }
  }

  onTableSort(event: SortEvent): void {
    this.toastService.info(`Ordenando columna: ${event.column}`, `Dirección: ${event.direction.toUpperCase()}`);
  }

  onTableSelection(selected: any[]): void {
    this.selectedTableUsers = selected;
  }

  onFilesUploaded(files: File[]): void {
    this.uploadedFilesCount = files.length;
    this.toastService.success('Archivos cargados', `Se procesaron ${files.length} archivo(s).`);
  }
}
