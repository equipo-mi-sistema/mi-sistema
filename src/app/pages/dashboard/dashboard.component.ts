import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WelcomeBannerComponent, EmptyStateCardComponent } from '../../shared/components/organism';
import { StatCardComponent } from '../../shared/components/molecules';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    WelcomeBannerComponent,
    StatCardComponent,
    EmptyStateCardComponent
  ],
  template: `
    <div class="space-y-6">
      <!-- Welcome Banner (Organismo) -->
      <app-welcome-banner
        chipText="Angular 20 &bull; Native Federation &bull; Tailwind CSS"
        title="Workspace Host Inicializado con Éxito"
      >
        La aplicación anfitriona <strong>sistema-host</strong> está configurada y lista para orquestar microfrontends (módulos pilar) con Native Federation y servicios de Firebase.
      </app-welcome-banner>

      <!-- Quick Status Cards Grid (Moléculas) -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
        <!-- Native Federation Card -->
        <app-stat-card
          title="Native Federation"
          description="Configurado con esbuild y cargador dinámico de microfrontends en el puerto 4200."
          badgeText="Activo"
          badgeVariant="success"
          iconName="cube"
          iconColorClass="bg-brand-50 text-brand-600"
          footerText="federation.config.js"
        ></app-stat-card>

        <!-- Tailwind CSS Card -->
        <app-stat-card
          title="Tailwind CSS"
          description="Paleta de colores personalizada de la marca (brand), utilidades y PostCSS integrados."
          badgeText="v3.4 Configurado"
          badgeVariant="success"
          iconName="code"
          iconColorClass="bg-cyan-50 text-cyan-600"
          footerText="tailwind.config.js"
        ></app-stat-card>

        <!-- Firebase Card -->
        <app-stat-card
          title="Firebase & AngularFire"
          description="Librerías @angular/fire y firebase preparadas para autenticación y base de datos Firestore."
          badgeText="Instalado"
          badgeVariant="brand"
          iconName="database"
          iconColorClass="bg-amber-50 text-amber-600"
          footerText="package.json"
        ></app-stat-card>
      </div>

      <!-- Microfrontends Slot Section (Organismo) -->
      <app-empty-state-card
        iconName="plus"
        title="Próximo paso: Agregar Módulos Pilar (Remotes)"
        description="Puedes generar aplicaciones remotas usando "
        codeSnippet="ng g app mi-remoto"
      >
        <p class="text-xs text-slate-500 mt-1">
          y federarlas mediante Native Federation para cargarlas dentro de este cascarón.
        </p>
      </app-empty-state-card>
    </div>
  `
})
export class DashboardComponent {}
