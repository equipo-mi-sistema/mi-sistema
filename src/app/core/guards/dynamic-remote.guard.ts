import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { RemoteManifestService } from '../services/remote-manifest.service';
import { AuthService } from '../auth/auth.service';

export const dynamicRemoteGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  _state: RouterStateSnapshot
) => {
  const manifestService = inject(RemoteManifestService);
  const authService = inject(AuthService);
  const router = inject(Router);

  // Determinar la ruta objetivo del microfrontend
  const targetPath = route.routeConfig?.path || '';
  const config = manifestService.getConfigByRoute(targetPath);

  // Si no existe la configuración o el Kill Switch está desactivado (active === false)
  if (!config || !config.active) {
    console.warn(`[Kill Switch] El microfrontend '${targetPath}' está inactivo o fuera de servicio.`);
    return router.createUrlTree(['/modulo-inactivo'], {
      queryParams: { module: targetPath, reason: 'inactive' }
    });
  }

  // Verificar si el rol del usuario está permitido
  const user = authService.currentUser();
  const userRole = user?.role_id || user?.role || null;
  const isAllowed = manifestService.isUserAllowed(targetPath, userRole);

  if (!isAllowed) {
    console.warn(`[Autorización] El rol '${userRole}' no tiene permiso para el microfrontend '${targetPath}'.`);
    return router.createUrlTree(['/modulo-inactivo'], {
      queryParams: { module: targetPath, reason: 'unauthorized' }
    });
  }

  return true;
};
