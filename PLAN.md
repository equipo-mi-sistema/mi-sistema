# Plan de Diseño Técnico (PLAN) - SISTEMA Host

> **Documento de Diseño Técnico (SDD - Spec-Driven Development)**  
> **Sistema**: Shell Host Polyrepo (Angular 20 + Native Federation)  
> **Documentos de Referencia**: [CONSTITUTION.md](file:///d:/App's%20Juancho/MI%20SISTEMA/mi-sistema/CONSTITUTION.md) | [SPEC.md](file:///d:/App's%20Juancho/MI%20SISTEMA/mi-sistema/SPEC.md)  
> **Seguimiento de Tareas**: [TASK.md](file:///d:/App's%20Juancho/MI%20SISTEMA/mi-sistema/TASK.md)

---

## 1. Visión y Alcance Arquitectónico

### 1.1 Propósito del Shell Host
`SISTEMA Host` opera como el orquestador central (Shell) del ecosistema Polyrepo. Sus responsabilidades arquitectónicas exclusivas son:
1. **Proveedor de Identidad Centralizado**: Autenticación única mediante Google OAuth via Firebase Auth.
2. **Control de Acceso Zero-Trust**: Verificación estricta de autorización basada en el registro `/users/{uid}` de Firestore antes de conceder acceso al dashboard.
3. **Gobernanza de Sesión en Tiempo Real**: Escucha reactiva (`onSnapshot`) sobre la vigencia del usuario y su rol con capacidad de expulsión inmediata multi-pestaña.
4. **Orquestador de Microfrontends Dinámicos**: Descubrimiento y carga bajo demanda (*lazy loading*) de microapps remotas mediante `@angular-architects/native-federation` guiado por Firestore `/config/microfrontends`.
5. **Kill Switch de Seguridad y Disponibilidad**: Bloqueo perimetral y visual de microfrontends inactivos o no autorizados.
6. **Sistema de Diseño Unificado y Tema**: Catálogo atómico maestro y persistencia local de tema (Dark/Light mode) sin sobrecarga de red.

### 1.2 Topología Técnica
- **Framework**: Angular 20 con arquitectura 100% Standalone (sin `NgModule`).
- **Federación**: Native Federation (ESM nativo en navegador, compatible con Vite/esbuild/Webpack).
- **Estilos**: Tailwind CSS 3.x con tokens corporativos `brand`, clases semánticas y modo oscuro basado en clase `.dark` sobre `<html>`.
- **Backend / BaaS**: Firebase Authentication, Cloud Firestore y Cloud Functions.

---

## 2. Arquitectura de Módulos e Integración

### 2.1 Core de Autenticación (`@sistema/auth`)
El subsistema de autenticación se consolida bajo `src/app/core/auth/` y se comparte como Singleton en la federación:

- **`AuthService`**:
  - Encapsula `FirebaseApp`, `Auth`, `GoogleAuthProvider` y consultas a `Firestore`.
  - Expone señales reactivas (`signal`, `computed`) para el estado de autenticación: `currentUser`, `isAuthenticated`, `userClaims`, `userRoles`, `isLoading`.
  - Gestiona el listener `onSnapshot` hacia `/users/{uid}`.
- **`AuthGuard`**:
  - Función guard standalone (`canActivateFn`) que verifica sesión activa, perfil Firestore existente, estado `ACTIVE` y rol válido.
- **`AuthInterceptor`**:
  - Interceptor HTTP funcional (`HttpInterceptorFn`) que recupera el Firebase ID Token (`getIdToken()`) y lo inyecta como cabecera `Authorization: Bearer <ID_TOKEN>` en peticiones salientes autorizadas.

```typescript
// Contrato de Usuario y Autorización Zero-Trust
export interface FirestoreUserDoc {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'LEADER' | 'OPERATOR' | null;
  team_id: string | null;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  updatedAt: string;
}

export interface AppUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: string;
  teamId: string;
  claims: Record<string, unknown>;
}
```

### 2.2 Configuración de Native Federation (`federation.config.js`)
Configuración para compartir dependencias del Shell con remotos asegurando una única instancia de Angular y Firebase:

```javascript
const { withNativeFederation, shareAll } = require('@angular-architects/native-federation/config');

module.exports = withNativeFederation({
  name: 'host',
  shared: {
    ...shareAll({
      singleton: true,
      strictVersion: true,
      requiredVersion: 'auto'
    }),
  },
  skip: [
    'rxjs/ajax',
    'rxjs/webSocket',
  ]
});
```

### 2.3 Orquestación Dinámica de Microfrontends (Manifest & Kill Switch)
Las microapps no están estáticas en el archivo de rutas; se cargan dinámicamente desde Firestore:

- **Colección**: `/config/microfrontends`
- **Modelo de Manifiesto**:
  ```typescript
  export interface MicrofrontendConfig {
    id: string;              // ej: 'mapeo'
    name: string;            // 'Módulo de Mapeo'
    routePath: string;       // 'mapeo'
    remoteEntry: string;     // 'http://localhost:4201/remoteEntry.json'
    exposedModule: string;   // './Component'
    active: boolean;         // Kill Switch: true | false
    rolesAllowed: string[];  // ['SUPER_ADMIN', 'ADMIN', 'OPERATOR']
    icon?: string;
    order: number;
  }
  ```
- **`RemoteManifestService`**:
  - Consulta `/config/microfrontends` en el arranque de la aplicación.
  - Almacena el manifiesto en un `signal<MicrofrontendConfig[]>`.
- **`DynamicRemoteGuard` (`canActivateFn`)**:
  - Verifica si `active === true`. Si es `false`, interrumpe la navegación y enruta hacia el componente de fallback `EmptyStateCardComponent` (Modo Mantenimiento).
  - Verifica si el `role` del usuario está incluido en `rolesAllowed`.

### 2.4 Gestión de Estado y Tema Visual (`ThemeService`)
- Persistencia local en `localStorage` bajo la clave `sistema_theme` (`'light' | 'dark'`).
- Señal reactiva `currentTheme = signal<'light' | 'dark'>('dark')`.
- Aplica o remueve la clase `.dark` sobre `document.documentElement` (`<html>`) en sincronía con eventos del usuario.
- Cero costo de red y sin parpadeo visual en carga inicial.

### 2.5 Catálogo de Diseño Atómico (Capa Shared)
Estructurado en `src/app/shared/components/`:
- **Átomos**: `GoogleButtonComponent`, `ButtonComponent`, `InputComponent`, `SpinnerComponent`, `ToggleComponent`.
- **Moléculas**: `AlertComponent` (con variantes `info`, `success`, `warning`, `danger`), `UserProfileComponent`, `NavItemComponent`, `EmptyStateCardComponent`.
- **Organismos**: `SidebarNavigationComponent` (filtra ítems según `active: true`), `HeaderUserBarComponent`.
- **Plantillas / Páginas**: `LoginPageComponent`, `DashboardComponent`, `LayoutComponent`.

---

## 3. Flujo de Datos, Ciclo de Vida y Protocolo Zero-Trust

### 3.1 Diagrama de Secuencia y Decisión de Autenticación

```text
[Usuario] ──(Click)──> [GoogleButtonComponent]
                              │
                              ▼
                     [AuthService.loginWithGoogle()]
                              │
                              ▼
                     [Firebase Auth (Google Popup)]
                              │
                    ┌─────────┴─────────┐
             (Éxito Token)        (Cancelado/Falla)
                    │                   │
                    ▼                   ▼
      [Query Firestore /users/{uid}]  [Mostrar Alert danger]
                    │
        ┌───────────┴───────────┐
 (Existe doc &           (No existe doc, rol==null
  role != null &          o team_id == null)
  team_id != null &             │
  status == 'ACTIVE')           ▼
        │             [EJECUTAR ZERO-TRUST REJECTION]
        │             1. firebase.auth().signOut()
        │             2. Purgar estado de sesión en memoria
        │             3. Redirigir a /auth/login
        │             4. Alert danger: "Acceso Denegado:
        │                Tu cuenta no tiene un rol asignado..."
        ▼
 [INICIALIZAR SESIÓN SHELL]
 1. Set currentUser signal
 2. Adjuntar onSnapshot a /users/{uid}
 3. Cargar RemoteManifestService
 4. Redirigir a Dashboard (/)
```

### 3.2 Gobernanza en Tiempo Real (`onSnapshot`)
1. Al autenticarse con éxito, `AuthService` establece un observador `onSnapshot(docRef)` sobre `/users/{uid}`.
2. Si el Administrador altera remotamente el documento:
   - `status !== 'ACTIVE'` (ej. `INACTIVE`, `SUSPENDED`) o
   - `role === null` (revocado):
3. `AuthService` ejecuta inmediatamente:
   - `signOut()` en Firebase.
   - Limpieza de señales y almacenamiento.
   - Redirección forzada hacia `/login`.
   - Despliegue de notificación de sesión revocada.

---

## 4. Estrategia de Pruebas y Aseguramiento de Calidad

### 4.1 Pirámide de Pruebas
1. **Pruebas Unitarias (Jasmine/Karma)**:
   - `AuthService`: Comportamiento de validación Zero-Trust, manejo de excepciones y signals reactivos.
   - `ThemeService`: Conmutación de tema y persistencia en `localStorage`.
   - `DynamicRemoteGuard`: Bloqueo de microfrontends inactivos y validación de `rolesAllowed`.
2. **Pruebas de Componentes (Harness / DOM Testing)**:
   - `AlertComponent`: Renderizado correcto de variantes (especialmente `danger`).
   - `SidebarNavigationComponent`: Filtrado reactivo de opciones según manifiesto activo.
3. **Pruebas de Contrato e Integración**:
   - Validación del schema de documento `/users/{uid}` y `/config/microfrontends`.
   - Compatibilidad de carga federada con `federation.config.js`.

---

## 5. Mapeo de Requerimientos SPEC vs Componentes del Plan

| Requerimiento SPEC | Componente de Solución en PLAN | Mecanismo de Control |
| :--- | :--- | :--- |
| **REQ-HOST-001** (Angular 20 Standalone) | `app.config.ts`, `federation.config.js` | Arquitectura Standalone + Native Federation |
| **REQ-HOST-002** (Google OAuth Popup) | `GoogleButtonComponent`, `AuthService` | `signInWithPopup(GoogleAuthProvider)` |
| **REQ-HOST-003** (Zero-Trust Exception) | `AuthService`, `AuthGuard`, `AlertComponent` | Verificación en `/users/{uid}`, `signOut()`, alerta `danger` |
| **REQ-HOST-004** (Listener onSnapshot) | `AuthService.attachUserSnapshot()` | Escucha en tiempo real sobre Firestore |
| **REQ-HOST-005** (Revocación Inmediata) | `AuthService` onSnapshot handler | Cierre de sesión y redirección automática si `INACTIVE` o `role == null` |
| **REQ-HOST-006** (Remote Manifest) | `RemoteManifestService` | Lectura de `/config/microfrontends` |
| **REQ-HOST-007** (Dynamic Routing Guard) | `DynamicRemoteGuard` | Verificación de `active: true` y `rolesAllowed` |
| **REQ-HOST-008** (Kill Switch Fallback) | `DynamicRemoteGuard`, `EmptyStateCardComponent` | Renderizado de estado fuera de servicio |
| **REQ-HOST-009** (Sidebar Dinámico) | `SidebarNavigationComponent` | Filtrado reactivo de ítems activos |
| **REQ-HOST-010** (Tema Toggle) | `HeaderUserBarComponent`, `ThemeService` | Conmutador de señal y clave `sistema_theme` |
| **REQ-HOST-011** (Persistencia .dark) | `ThemeService` | Adición/eliminación de clase `.dark` en `<html>` |
