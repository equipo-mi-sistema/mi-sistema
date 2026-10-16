import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BadgeComponent, ButtonComponent, IconComponent, ToggleComponent } from '../shared/components/atomics';
import { UserProfileComponent } from '../shared/components/molecules';
import { MenuComponent, MenuItem, ToastContainerComponent } from '../shared/components/organism';
import { AuthService } from '../core/auth/auth.service';
import { ThemeService } from '../core/services/theme.service';
import { RemoteManifestService } from '../core/services/remote-manifest.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    BadgeComponent,
    ButtonComponent,
    IconComponent,
    ToggleComponent,
    UserProfileComponent,
    MenuComponent,
    ToastContainerComponent
  ],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent {
  readonly authService = inject(AuthService);
  readonly themeService = inject(ThemeService);
  readonly manifestService = inject(RemoteManifestService);

  // Sidebar state using Angular signals
  isSidebarOpen = signal<boolean>(true);
  isMobileMenuOpen = signal<boolean>(false);

  // Datos reactivos del usuario autenticado
  userName = computed(() => this.authService.currentUser()?.displayName || 'Usuario');
  userEmail = computed(() => this.authService.currentUser()?.email || 'usuario@sistema.local');
  userRole = computed(() => this.authService.currentUser()?.role || null);
  userInitials = computed(() => {
    const name = this.userName();
    const parts = name.split(' ').filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return (name.slice(0, 2) || 'US').toUpperCase();
  });

  // Menú dinámico filtrado reactivamente por Kill Switch y roles (REQ-HOST-009)
  readonly menuItems = computed<MenuItem[]>(() => {
    const role = this.userRole();

    // Obtener microfrontends activos en Firestore permitidos para el rol
    const dynamicRemoteItems: MenuItem[] = this.manifestService
      .activeConfigs()
      .filter((cfg) => this.manifestService.isUserAllowed(cfg.routePath, role))
      .map((cfg) => ({
        label: cfg.name,
        icon: cfg.icon || 'extension',
        route: `/${cfg.routePath}`,
        badge: cfg.badge || 'Remoto'
      }));

    return [
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
      ...dynamicRemoteItems,
      { label: 'Configuración', icon: 'settings', route: '/configuracion' }
    ];
  });

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
    if (!this.isSidebarOpen() && item.children && item.children.length > 0) {
      this.isSidebarOpen.set(true);
    }
  }

  onMobileMenuItemClick(item: MenuItem): void {
    if (item.route) {
      this.closeMobileMenu();
    }
  }

  onThemeToggle(isDark: boolean): void {
    this.themeService.setTheme(isDark ? 'dark' : 'light');
  }

  async logout(): Promise<void> {
    await this.authService.logout();
  }
}
