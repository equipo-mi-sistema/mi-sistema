import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BadgeComponent, ButtonComponent, IconComponent } from '../shared/components/atomics';
import { UserProfileComponent, NavItemComponent } from '../shared/components/molecules';
import { AuthService } from '../core/auth/auth.service';

interface NavItem {
  label: string;
  icon: string;
  route: string;
  badge?: string;
}

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
    NavItemComponent
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

  // Navigation items for the host shell
  navItems: NavItem[] = [
    { label: 'Panel Principal', icon: 'dashboard', route: '/' },
    { label: 'Administración', icon: 'extension', route: '/administracion', badge: 'Remoto' },
    { label: 'Configuración', icon: 'settings', route: '/configuracion' }
  ];

  toggleSidebar() {
    this.isSidebarOpen.update(open => !open);
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen.update(open => !open);
  }

  async logout() {
    await this.authService.logout();
  }
}
