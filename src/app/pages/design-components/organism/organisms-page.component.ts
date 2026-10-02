import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BadgeComponent, ButtonComponent } from '../../../shared/components/atomics';
import {
  WelcomeBannerComponent,
  EmptyStateCardComponent,
  MenuComponent,
  MenuItem
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
    MenuComponent
  ],
  templateUrl: './organisms-page.component.html'
})
export class OrganismsPageComponent {
  lastMenuAction = 'Ninguna acción aún';

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
}
