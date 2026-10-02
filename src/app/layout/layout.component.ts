import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BadgeComponent, ButtonComponent, IconComponent } from '../shared/components/atomics';
import { UserProfileComponent } from '../shared/components/molecules';
import { MenuComponent, MenuItem, ToastContainerComponent } from '../shared/components/organism';
import { AuthService } from '../core/auth/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    BadgeComponent,
    ButtonComponent,
    IconComponent,
    UserProfileComponent,
    MenuComponent,
    ToastContainerComponent
  ],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent {
  readonly authService = inject(AuthService);

  // Sidebar state using Angular signals
  isSidebarOpen = signal<boolean>(true);
  isMobileMenuOpen = signal<boolean>(false);

  // Datos reactivos del usuario autenticado
  userName = computed(() => this.authService.currentUser()?.displayName || 'Usuario');
  userEmail = computed(() => this.authService.currentUser()?.email || 'usuario@sistema.local');
  userInitials = computed(() => {
    const name = this.userName();
    const parts = name.split(' ').filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return (name.slice(0, 2) || 'US').toUpperCase();
  });

  // Reusable Navigation items with sub-menus support
  menuItems: MenuItem[] = [
    { label: 'Panel Principal', icon: 'dashboard', route: '/', exact: true },
    {
      label: 'Componentes de diseño',
      icon: 'palette',
      children: [
        { label: 'Atómicos', route: '/componentes-diseno/atomicos', icon: 'cube' },
        { label: 'Moléculas', route: '/componentes-diseno/moleculas', icon: 'extension' },
        { label: 'Organismos', route: '/componentes-diseno/organismos', icon: 'palette' }
      ]
    },
    { label: 'Administración', icon: 'extension', route: '/administracion', badge: 'Remoto' },
    { label: 'Configuración', icon: 'settings', route: '/configuracion' }
  ];

  toggleSidebar(): void {
    this.isSidebarOpen.update((open) => !open);
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen.update((open) => !open);
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen.set(false);
  }

  onDesktopMenuItemClick(item: MenuItem): void {
    // Si la barra está colapsada y se pulsa una opción con submenús, expandir la barra para ver las opciones
    if (!this.isSidebarOpen() && item.children && item.children.length > 0) {
      this.isSidebarOpen.set(true);
    }
  }

  onMobileMenuItemClick(item: MenuItem): void {
    if (item.route) {
      this.closeMobileMenu();
    }
  }

  async logout(): Promise<void> {
    await this.authService.logout();
  }
}
