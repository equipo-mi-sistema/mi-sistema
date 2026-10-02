import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BadgeComponent } from '../../../shared/components/atomics';
import {
  AccordionItemComponent,
  AlertComponent,
  SelectComponent,
  SelectOption,
  StatCardComponent,
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
    AccordionItemComponent
  ],
  templateUrl: './molecules-page.component.html'
})
export class MoleculesPageComponent {
  selectedRole = 'admin';
  lastAlertDismissed = '';

  roleOptions: SelectOption[] = [
    { label: 'Administrador del Sistema', value: 'admin' },
    { label: 'Editor de Contenido', value: 'editor' },
    { label: 'Consultor / Lector', value: 'viewer' },
    { label: 'Auditor Externo (deshabilitado)', value: 'auditor', disabled: true }
  ];

  onAlertDismiss(type: string): void {
    this.lastAlertDismissed = `Alerta tipo ${type} descartada.`;
  }
}
