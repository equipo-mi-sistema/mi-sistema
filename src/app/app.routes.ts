import { Routes } from '@angular/router';
import { loadRemoteModule } from '@angular-architects/native-federation';
import { LayoutComponent } from './layout/layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { authGuard } from './core/auth/guards/auth.guard';
import { publicOnlyGuard } from './core/auth/guards/public-only.guard';
import { dynamicRemoteGuard } from './core/guards/dynamic-remote.guard';

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [publicOnlyGuard],
    loadComponent: () =>
      import('./pages/auth/login-page.component').then(
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
        path: 'modulo-inactivo',
        loadComponent: () =>
          import('./pages/fallback/remote-fallback.component').then(
            (m) => m.RemoteFallbackComponent
          ),
        title: 'Sistema Host | Módulo Inactivo'
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
        canActivate: [dynamicRemoteGuard],
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
      },
      {
        path: 'mapeo',
        canActivate: [dynamicRemoteGuard],
        loadChildren: () =>
          loadRemoteModule('mapeo', './routes')
            .then((m) => m.routes)
            .catch(() =>
              import('./pages/fallback/remote-fallback.component').then(
                (m) => m.FALLBACK_ROUTES
              )
            ),
        title: 'Sistema Host | Módulo Mapeo'
      },
      {
        path: 'gestion',
        canActivate: [dynamicRemoteGuard],
        loadChildren: () =>
          loadRemoteModule('gestion', './routes')
            .then((m) => m.routes)
            .catch(() =>
              import('./pages/fallback/remote-fallback.component').then(
                (m) => m.FALLBACK_ROUTES
              )
            ),
        title: 'Sistema Host | Módulo Gestión'
      },
      {
        path: 'asistencia',
        canActivate: [dynamicRemoteGuard],
        loadChildren: () =>
          loadRemoteModule('asistencia', './routes')
            .then((m) => m.routes)
            .catch(() =>
              import('./pages/fallback/remote-fallback.component').then(
                (m) => m.FALLBACK_ROUTES
              )
            ),
        title: 'Sistema Host | Módulo Asistencia'
      },
      {
        path: 'transporte',
        canActivate: [dynamicRemoteGuard],
        loadChildren: () =>
          loadRemoteModule('transporte', './routes')
            .then((m) => m.routes)
            .catch(() =>
              import('./pages/fallback/remote-fallback.component').then(
                (m) => m.FALLBACK_ROUTES
              )
            ),
        title: 'Sistema Host | Módulo Transporte'
      },
      {
        path: 'conteo',
        canActivate: [dynamicRemoteGuard],
        loadChildren: () =>
          loadRemoteModule('conteo', './routes')
            .then((m) => m.routes)
            .catch(() =>
              import('./pages/fallback/remote-fallback.component').then(
                (m) => m.FALLBACK_ROUTES
              )
            ),
        title: 'Sistema Host | Módulo Conteo'
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
