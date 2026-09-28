import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BadgeComponent, ButtonComponent, IconComponent } from '../shared/components/atomics';
import { UserProfileComponent, NavItemComponent } from '../shared/components/molecules';

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
  // Sidebar state using Angular signals
  isSidebarOpen = signal<boolean>(true);
  isMobileMenuOpen = signal<boolean>(false);

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
}
