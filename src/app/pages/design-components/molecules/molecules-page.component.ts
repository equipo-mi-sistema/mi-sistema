import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BadgeComponent } from '../../../shared/components/atomics';
import {
  AccordionItemComponent,
  AlertComponent,
  BreadcrumbComponent,
  BreadcrumbItem,
  DropdownComponent,
  DropdownItem,
  PaginationComponent,
  SearchInputComponent,
  SelectComponent,
  SelectOption,
  StatCardComponent,
  TooltipComponent,
  UserProfileComponent
} from '../../../shared/components/molecules';

@Component({
  selector: 'app-molecules-page',
  standalone: true,
  imports: [
    CommonModule,
    BadgeComponent,
    StatCardComponent,
    UserProfileComponent,
    AlertComponent,
    SelectComponent,
    AccordionItemComponent,
    SearchInputComponent,
    DropdownComponent,
    BreadcrumbComponent,
    PaginationComponent,
    TooltipComponent
  ],
  templateUrl: './molecules-page.component.html'
})
export class MoleculesPageComponent {
  selectedRole = 'admin';
  lastAlertDismissed = '';
  searchQuery = '';
  lastActionSelected = 'Ninguna acción aún';
  currentPage = 1;
  pageSize = 10;
  totalRecords = 125;

  roleOptions: SelectOption[] = [
    { label: 'Administrador del Sistema', value: 'admin' },
    { label: 'Editor de Contenido', value: 'editor' },
    { label: 'Consultor / Lector', value: 'viewer' },
    { label: 'Auditor Externo (deshabilitado)', value: 'auditor', disabled: true }
  ];

  dropdownActions: DropdownItem[] = [
    { id: 'view', label: 'Ver detalles', icon: 'info' },
    { id: 'edit', label: 'Editar registro', icon: 'settings' },
    { id: 'duplicate', label: 'Duplicar', icon: 'plus' },
    { id: 'delete', label: 'Eliminar', icon: 'trash', danger: true }
  ];

  sampleBreadcrumbs: BreadcrumbItem[] = [
    { label: 'Inicio', url: '/', icon: 'dashboard' },
    { label: 'Componentes de diseño', url: '/componentes-diseno' },
    { label: 'Moléculas', icon: 'extension' }
  ];

  onAlertDismiss(type: string): void {
    this.lastAlertDismissed = `Alerta tipo ${type} descartada.`;
  }

  onSearch(query: string): void {
    this.searchQuery = query;
  }

  onActionSelect(item: DropdownItem): void {
    this.lastActionSelected = `Acción ejecutada: ${item.label}`;
  }

  onPageChange(page: number): void {
    this.currentPage = page;
  }

  onPageSizeChange(size: number): void {
    this.pageSize = size;
  }
}
