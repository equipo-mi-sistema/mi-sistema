import { Routes } from '@angular/router';
import { loadRemoteModule } from '@angular-architects/native-federation';
import { LayoutComponent } from './layout/layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        component: DashboardComponent,
        title: 'Sistema Host | Panel Principal'
      },
      {
        path: 'administracion',
        loadChildren: () =>
          loadRemoteModule('administracion', './routes')
            .then(m => m.routes)
            .catch(err => {
              console.warn('Microfrontend "administracion" no disponible aún:', err);
              return import('./pages/fallback/remote-fallback.component').then(m => m.FALLBACK_ROUTES);
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
