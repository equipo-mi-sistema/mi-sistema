import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { dynamicRemoteGuard } from './dynamic-remote.guard';
import { RemoteManifestService } from '../services/remote-manifest.service';
import { AuthService } from '../auth/auth.service';

describe('dynamicRemoteGuard', () => {
  let mockManifestService: jasmine.SpyObj<RemoteManifestService>;
  let mockAuthService: any;
  let router: Router;

  beforeEach(() => {
    mockManifestService = jasmine.createSpyObj('RemoteManifestService', [
      'getConfigByRoute',
      'isUserAllowed'
    ]);

    mockAuthService = {
      currentUser: jasmine.createSpy('currentUser').and.returnValue({
        role: 'ADMIN'
      })
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: RemoteManifestService, useValue: mockManifestService },
        { provide: AuthService, useValue: mockAuthService }
      ]
    });

    router = TestBed.inject(Router);
  });

  it('should redirect to /modulo-inactivo when module is inactive', () => {
    mockManifestService.getConfigByRoute.and.returnValue({
      id: 'mapeo',
      name: 'Mapeo Territorial',
      routePath: 'mapeo',
      remoteEntry: '',
      exposedModule: '',
      active: false,
      rolesAllowed: ['ADMIN'],
      order: 1
    });

    const route = {
      routeConfig: { path: 'mapeo' }
    } as unknown as ActivatedRouteSnapshot;

    const result = TestBed.runInInjectionContext(() =>
      dynamicRemoteGuard(route, {} as RouterStateSnapshot)
    );

    expect(result instanceof UrlTree).toBeTrue();
    const urlTree = result as UrlTree;
    expect(urlTree.toString()).toContain('/modulo-inactivo');
    expect(urlTree.queryParams['reason']).toBe('inactive');
  });

  it('should redirect to /modulo-inactivo with unauthorized reason if role not allowed', () => {
    mockManifestService.getConfigByRoute.and.returnValue({
      id: 'administracion',
      name: 'Administración',
      routePath: 'administracion',
      remoteEntry: '',
      exposedModule: '',
      active: true,
      rolesAllowed: ['SUPER_ADMIN'],
      order: 1
    });
    mockManifestService.isUserAllowed.and.returnValue(false);

    const route = {
      routeConfig: { path: 'administracion' }
    } as unknown as ActivatedRouteSnapshot;

    const result = TestBed.runInInjectionContext(() =>
      dynamicRemoteGuard(route, {} as RouterStateSnapshot)
    );

    expect(result instanceof UrlTree).toBeTrue();
    const urlTree = result as UrlTree;
    expect(urlTree.toString()).toContain('/modulo-inactivo');
    expect(urlTree.queryParams['reason']).toBe('unauthorized');
  });

  it('should allow navigation when module is active and user role is allowed', () => {
    mockManifestService.getConfigByRoute.and.returnValue({
      id: 'administracion',
      name: 'Administración',
      routePath: 'administracion',
      remoteEntry: '',
      exposedModule: '',
      active: true,
      rolesAllowed: ['ADMIN'],
      order: 1
    });
    mockManifestService.isUserAllowed.and.returnValue(true);

    const route = {
      routeConfig: { path: 'administracion' }
    } as unknown as ActivatedRouteSnapshot;

    const result = TestBed.runInInjectionContext(() =>
      dynamicRemoteGuard(route, {} as RouterStateSnapshot)
    );

    expect(result).toBeTrue();
  });
});
