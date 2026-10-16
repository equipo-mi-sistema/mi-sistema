import { Injectable, inject, signal, computed, NgZone } from '@angular/core';
import { 
  Auth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  user, 
  getIdTokenResult, 
  User 
} from '@angular/fire/auth';
import { 
  Firestore, 
  doc, 
  getDoc, 
  onSnapshot, 
  Unsubscribe 
} from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AppUser, CustomUserClaims, FirestoreUserDoc, UserRole } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly auth: Auth = inject(Auth);
  private readonly firestore: Firestore = inject(Firestore);
  private readonly router: Router = inject(Router);
  private readonly ngZone: NgZone = inject(NgZone);

  static readonly ZERO_TRUST_DENIED_MESSAGE = 
    'Acceso Denegado: Tu cuenta no tiene un rol asignado. Contacta a tu Líder o Administrador.';
  static readonly SESSION_REVOKED_MESSAGE = 
    'Acceso Revocado: Tu cuenta ha sido desactivada o tu rol ha sido modificado. Contacta a tu Administrador.';

  // Signals de estado reactivo
  readonly currentUser = signal<AppUser | null>(null);
  readonly isLoading = signal<boolean>(true);
  readonly authError = signal<string | null>(null);

  // Computed signals
  readonly isAuthenticated = computed(() => !!this.currentUser());
  readonly userClaims = computed<CustomUserClaims>(() => this.currentUser()?.claims ?? {});
  readonly userRole = computed<UserRole>(() => this.currentUser()?.role_id ?? this.currentUser()?.role ?? null);
  readonly userRoleId = computed<string | null>(() => this.currentUser()?.role_id ?? (this.currentUser()?.role as string) ?? null);
  readonly userTeamId = computed<string | null>(() => this.currentUser()?.team_id ?? this.currentUser()?.teamId ?? null);
  readonly userRoles = computed<string[]>(() => {
    const directRole = this.currentUser()?.role_id || this.currentUser()?.role;
    const claimsRoles = (this.currentUser()?.claims.roles as string[]) || [];
    if (directRole && !claimsRoles.includes(directRole)) {
      return [directRole, ...claimsRoles];
    }
    return claimsRoles;
  });
  readonly userModules = computed<string[]>(() => (this.currentUser()?.claims.modules as string[]) || []);
  readonly userScope = computed<string>(() => (this.currentUser()?.claims.scope as string) || '');

  // Listener para cancelar onSnapshot al cerrar sesión
  private userSnapshotUnsubscribe: Unsubscribe | null = null;

  // Observable nativo de Firebase Auth
  readonly authState$: Observable<User | null> = user(this.auth);

  constructor() {
    this.initAuthStateListener();
  }

  /**
   * Valida si los datos del documento Firestore cumplen con el protocolo Zero-Trust
   */
  private isValidUserDoc(data: FirestoreUserDoc | undefined | null): data is FirestoreUserDoc {
    const roleId = data?.role_id || data?.role;
    return !!(
      data &&
      data.status === 'ACTIVE' &&
      roleId !== null &&
      roleId !== undefined &&
      data.team_id !== null &&
      data.team_id !== undefined
    );
  }

  /**
   * Escucha reactivamente los cambios de sesión de Firebase Auth y aplica Zero-Trust
   */
  private initAuthStateListener(): void {
    this.authState$.subscribe(async (firebaseUser) => {
      this.isLoading.set(true);

      if (firebaseUser) {
        try {
          await this.verifyAndSyncUser(firebaseUser);
        } catch (error) {
          console.error('Error al sincronizar y verificar usuario Zero-Trust:', error);
          await this.handleZeroTrustRejection(AuthService.ZERO_TRUST_DENIED_MESSAGE);
        }
      } else {
        this.detachUserSnapshot();
        this.currentUser.set(null);
      }

      this.isLoading.set(false);
    });
  }

  /**
   * Consulta el documento /users/{uid} en Firestore y verifica condiciones Zero-Trust
   */
  async verifyAndSyncUser(firebaseUser: User): Promise<AppUser | null> {
    const userDocRef = doc(this.firestore, 'users', firebaseUser.uid);
    const docSnap = await getDoc(userDocRef);

    if (!docSnap.exists()) {
      await this.handleZeroTrustRejection(AuthService.ZERO_TRUST_DENIED_MESSAGE);
      return null;
    }

    const userData = docSnap.data() as FirestoreUserDoc;

    if (!this.isValidUserDoc(userData)) {
      await this.handleZeroTrustRejection(AuthService.ZERO_TRUST_DENIED_MESSAGE);
      return null;
    }

    // Obtener claims del token
    const tokenResult = await getIdTokenResult(firebaseUser, false);
    const claims = (tokenResult.claims || {}) as CustomUserClaims;
    const effectiveRole = (userData.role_id || userData.role || claims.role_id || (claims.roles && claims.roles[0]) || null) as UserRole;
    const effectiveTeam = userData.team_id || (claims.team_id as string) || null;

    const appUser: AppUser = {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      displayName: firebaseUser.displayName,
      photoURL: firebaseUser.photoURL,
      role: effectiveRole,
      role_id: (effectiveRole as string) || null,
      roleId: (effectiveRole as string) || null,
      teamId: effectiveTeam,
      team_id: effectiveTeam,
      cargo: userData.cargo,
      status: userData.status,
      claims: {
        role_id: (effectiveRole as string) || undefined,
        team_id: effectiveTeam || undefined,
        roles: (claims['roles'] as string[]) || (effectiveRole ? [effectiveRole as string] : []),
        modules: (claims['modules'] as string[]) || [],
        scope: (claims['scope'] as string) || '',
        ...claims
      }
    };

    this.currentUser.set(appUser);
    this.authError.set(null);

    // Adjuntar listener onSnapshot para cambios en tiempo real
    this.attachUserSnapshot(firebaseUser.uid);

    return appUser;
  }

  /**
   * Adjunta un listener onSnapshot sobre /users/{uid} para gobernanza en tiempo real
   */
  private attachUserSnapshot(uid: string): void {
    this.detachUserSnapshot();

    const userDocRef = doc(this.firestore, 'users', uid);
    this.userSnapshotUnsubscribe = onSnapshot(
      userDocRef,
      (snapshot) => {
        this.ngZone.run(async () => {
          if (!snapshot.exists()) {
            await this.handleZeroTrustRejection(AuthService.SESSION_REVOKED_MESSAGE);
            return;
          }

          const data = snapshot.data() as FirestoreUserDoc;
          const effectiveRole = (data.role_id || data.role) as UserRole;
          if (data.status !== 'ACTIVE' || !effectiveRole || !data.team_id) {
            await this.handleZeroTrustRejection(AuthService.SESSION_REVOKED_MESSAGE);
            return;
          }

          // Si el documento sigue siendo válido, actualizar el signal de usuario reactivo
          this.currentUser.update((current) => {
            if (!current) return null;
            return {
              ...current,
              role: effectiveRole,
              role_id: (effectiveRole as string) || null,
              roleId: (effectiveRole as string) || null,
              teamId: data.team_id,
              team_id: data.team_id,
              cargo: data.cargo || current.cargo,
              status: data.status,
              displayName: data.displayName || current.displayName,
              claims: {
                ...current.claims,
                role_id: (effectiveRole as string) || undefined,
                team_id: data.team_id || undefined,
                roles: current.claims.roles || (effectiveRole ? [effectiveRole as string] : [])
              }
            };
          });
        });
      },
      (error) => {
        console.error('Error en listener onSnapshot de usuario:', error);
      }
    );
  }

  /**
   * Remueve el listener de snapshot
   */
  private detachUserSnapshot(): void {
    if (this.userSnapshotUnsubscribe) {
      this.userSnapshotUnsubscribe();
      this.userSnapshotUnsubscribe = null;
    }
  }

  /**
   * Protocolo de expulsión Zero-Trust:
   * 1. Detener listeners
   * 2. Purgar estado en memoria
   * 3. Publicar error en authError
   * 4. Cerrar sesión en Firebase
   * 5. Redirigir hacia /login
   */
  async handleZeroTrustRejection(errorMessage: string): Promise<void> {
    this.detachUserSnapshot();
    this.currentUser.set(null);
    this.authError.set(errorMessage);

    try {
      await signOut(this.auth);
    } catch (e) {
      console.warn('Error al ejecutar signOut en rechazo Zero-Trust:', e);
    }

    await this.router.navigate(['/login']);
  }

  /**
   * Inicio de sesión exclusivo mediante Google SSO (Popup).
   */
  async loginWithGoogle(): Promise<AppUser | null> {
    this.authError.set(null);
    this.isLoading.set(true);

    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });

      const credential = await signInWithPopup(this.auth, provider);
      const appUser = await this.verifyAndSyncUser(credential.user);

      if (!appUser) {
        throw new Error(AuthService.ZERO_TRUST_DENIED_MESSAGE);
      }

      return appUser;
    } catch (error: any) {
      console.error('Fallo en Google SSO o verificación Zero-Trust:', error);
      let message = this.authError() || 'Ocurrió un error al iniciar sesión con Google.';
      if (error?.code === 'auth/popup-closed-by-user') {
        message = 'La ventana de inicio de sesión se cerró antes de completar el proceso.';
      } else if (error?.code === 'auth/cancelled-popup-request') {
        message = 'Solicitud de autenticación cancelada.';
      } else if (error?.code === 'auth/network-request-failed') {
        message = 'Error de red. Verifica tu conexión a internet.';
      } else if (error?.message && !this.authError()) {
        message = error.message;
      }
      this.authError.set(message);
      throw error;
    } finally {
      this.isLoading.set(false);
    }
  }

  /**
   * Cierre de sesión y redirección a login.
   */
  async logout(): Promise<void> {
    this.isLoading.set(true);
    try {
      this.detachUserSnapshot();
      await signOut(this.auth);
      this.currentUser.set(null);
      this.authError.set(null);
      await this.router.navigate(['/login']);
    } finally {
      this.isLoading.set(false);
    }
  }

  /**
   * Obtiene el token JWT actual (Bearer) para adjuntar en cabeceras de red.
   */
  async getIdToken(forceRefresh = false): Promise<string | null> {
    const activeUser = this.auth.currentUser;
    return activeUser ? await activeUser.getIdToken(forceRefresh) : null;
  }
}
