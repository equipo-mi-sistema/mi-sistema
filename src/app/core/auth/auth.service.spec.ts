import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { Auth } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';

describe('AuthService (Zero-Trust Logic)', () => {
  let service: AuthService;
  let mockAuth: any;
  let mockFirestore: any;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(() => {
    mockAuth = {
      currentUser: null
    };

    mockFirestore = {};

    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockRouter.navigate.and.returnValue(Promise.resolve(true));

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: Auth, useValue: mockAuth },
        { provide: Firestore, useValue: mockFirestore },
        { provide: Router, useValue: mockRouter }
      ]
    });

    service = TestBed.inject(AuthService);
  });

  it('should initialize with null user and unauthenticated state', () => {
    expect(service.currentUser()).toBeNull();
    expect(service.isAuthenticated()).toBeFalse();
  });

  it('should handle Zero-Trust rejection by clearing user, setting danger error, and navigating to login', async () => {
    // Simular rechazo Zero-Trust
    await service.handleZeroTrustRejection(AuthService.ZERO_TRUST_DENIED_MESSAGE);

    expect(service.currentUser()).toBeNull();
    expect(service.isAuthenticated()).toBeFalse();
    expect(service.authError()).toBe(AuthService.ZERO_TRUST_DENIED_MESSAGE);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should clear error on logout and navigate to login', async () => {
    await service.logout();

    expect(service.currentUser()).toBeNull();
    expect(service.authError()).toBeNull();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });
});
