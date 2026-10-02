import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BadgeComponent, ButtonComponent } from '../../../shared/components/atomics';
import { AccordionItemComponent } from '../../../shared/components/molecules';
import {
  AccordionComponent,
  ConfirmModalComponent,
  EmptyStateCardComponent,
  MenuComponent,
  MenuItem,
  ModalComponent,
  NotificationModalComponent,
  WelcomeBannerComponent
} from '../../../shared/components/organism';

@Component({
  selector: 'app-organisms-page',
  standalone: true,
  imports: [
    CommonModule,
    BadgeComponent,
    ButtonComponent,
    WelcomeBannerComponent,
    EmptyStateCardComponent,
    MenuComponent,
    AccordionComponent,
    AccordionItemComponent,
    ModalComponent,
    ConfirmModalComponent,
    NotificationModalComponent
  ],
  templateUrl: './organisms-page.component.html'
})
export class OrganismsPageComponent {
  lastMenuAction = 'Ninguna acción aún';

  // Estados de Modales
  isBaseModalOpen = false;
  isConfirmModalOpen = false;
  isConfirmLoading = false;
  isNotificationModalOpen = false;
  notificationType: 'success' | 'info' | 'warning' | 'error' = 'success';
  lastModalResult = 'Sin acciones recientes de modal';

  // Configuración de acordeón
  accordionModeActive = true;

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
    }, 1500);
  }

  handleCancelAction(): void {
    this.lastModalResult = 'Acción cancelada por el usuario.';
  }

  openNotification(type: 'success' | 'info' | 'warning' | 'error'): void {
    this.notificationType = type;
    this.isNotificationModalOpen = true;
  }
}
