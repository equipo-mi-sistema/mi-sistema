import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Routes } from '@angular/router';
import { EmptyStateCardComponent } from '../../shared/components/organism/empty-state-card.component';
import { ButtonComponent } from '../../shared/components/atomics/button.component';

@Component({
  selector: 'app-remote-fallback',
  standalone: true,
  imports: [CommonModule, RouterModule, EmptyStateCardComponent, ButtonComponent],
  template: `
    <div class="py-8 px-4 max-w-2xl mx-auto">
      <app-empty-state-card
        [iconName]="iconName"
        [title]="cardTitle"
        [description]="cardDescription"
        [codeSnippet]="codeSnippet"
      >
        <div class="flex items-center justify-center gap-3 mt-4">
          <a routerLink="/">
            <app-button variant="primary" size="md">
              Volver al Panel Principal
            </app-button>
          </a>
        </div>
      </app-empty-state-card>
    </div>
  `
})
export class RemoteFallbackComponent {
  private readonly route = inject(ActivatedRoute);

  get moduleName(): string {
    return this.route.snapshot.queryParamMap.get('module') || 'módulo';
  }

  get reason(): string {
    return this.route.snapshot.queryParamMap.get('reason') || 'inactive';
  }

  get iconName(): string {
    if (this.reason === 'unauthorized') return 'lock';
    return 'settings';
  }

  get cardTitle(): string {
    if (this.reason === 'unauthorized') {
      return `Acceso Restringido: Módulo ${this.moduleName}`;
    }
    return `Módulo Fuera de Servicio: ${this.moduleName}`;
  }

  get cardDescription(): string {
    if (this.reason === 'unauthorized') {
      return `Tu rol actual no tiene permisos suficientes para acceder a este microfrontend. Contacta al Administrador.`;
    }
    return `Este microfrontend se encuentra actualmente inactivo por políticas de mantenimiento o Kill Switch de Firestore.`;
  }

  get codeSnippet(): string {
    return `kill_switch: active = false`;
  }
}

export const FALLBACK_ROUTES: Routes = [
  {
    path: '',
    component: RemoteFallbackComponent
  }
];
