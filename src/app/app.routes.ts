import { Routes } from '@angular/router';
import { loadRemoteModule } from '@angular-architects/native-federation';
import { LayoutComponent } from './layout/layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { authGuard } from './core/auth/guards/auth.guard';
import { publicOnlyGuard } from './core/auth/guards/public-only.guard';

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [publicOnlyGuard],
    loadComponent: () =>
      import('./shared/components/organism/login-page.component').then(
        (m) => m.LoginPageComponent
      ),
    title: 'Sistema Host | Iniciar Sesión'
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        component: DashboardComponent,
        title: 'Sistema Host | Panel Principal'
      },
      {
        path: 'componentes-diseno',
        loadComponent: () =>
          import('./pages/design-components/design-components.component').then(
            (m) => m.DesignComponentsComponent
          ),
        children: [
          {
            path: '',
            redirectTo: 'atomicos',
            pathMatch: 'full'
          },
          {
            path: 'atomicos',
            loadComponent: () =>
              import('./pages/design-components/atomics/atomics-page.component').then(
                (m) => m.AtomicsPageComponent
              ),
            title: 'Sistema Host | Componentes de Diseño - Átomos'
          },
          {
            path: 'moleculas',
            loadComponent: () =>
              import('./pages/design-components/molecules/molecules-page.component').then(
                (m) => m.MoleculesPageComponent
              ),
            title: 'Sistema Host | Componentes de Diseño - Moléculas'
          },
          {
            path: 'organismos',
            loadComponent: () =>
              import('./pages/design-components/organism/organisms-page.component').then(
                (m) => m.OrganismsPageComponent
              ),
            title: 'Sistema Host | Componentes de Diseño - Organismos'
          }
        ]
      },
      {
        path: 'administracion',
        loadChildren: () =>
          loadRemoteModule('administracion', './routes')
            .then((m) => m.routes)
            .catch((err) => {
              console.warn('Microfrontend "administracion" no disponible aún:', err);
              return import('./pages/fallback/remote-fallback.component').then(
                (m) => m.FALLBACK_ROUTES
              );
            }),
        title: 'Sistema Host | Módulo Administración'
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
