# Plan de Tareas de Implementación (TASKS) - SISTEMA Host

> **Documento de Tareas de Implementación (SDD - Spec-Driven Development)**  
> **Sistema**: Shell Host Polyrepo (Angular 20 + Native Federation)  
> **Especificación Base**: [SPEC.md](file:///d:/App's%20Juancho/MI%20SISTEMA/mi-sistema/SPEC.md)  
> **Diseño Técnico**: [PLAN.md](file:///d:/App's%20Juancho/MI%20SISTEMA/mi-sistema/PLAN.md)  
> **Gobernanza**: [CONSTITUTION.md](file:///d:/App's%20Juancho/MI%20SISTEMA/mi-sistema/CONSTITUTION.md)

---

## Matriz de Trazabilidad SDD (SPEC ➔ PLAN ➔ TASK)

| ID Requisito | Descripción Sintética | Fase | Tareas Asociadas | Estado |
| :--- | :--- | :---: | :--- | :---: |
| **REQ-HOST-001** | Shell Angular 20 Standalone + Native Federation | Fase 1 | TASK-1.1, TASK-1.2, TASK-1.3 | [x] |
| **REQ-HOST-002** | Login con Google OAuth vía `GoogleButtonComponent` | Fase 2, 3 | TASK-2.1, TASK-3.1 | [x] |
| **REQ-HOST-003** | Rechazo Zero-Trust (`role_id`/`team_id` ausentes) + Alerta `danger` | Fase 2, 3 | TASK-2.2, TASK-3.2, TASK-3.3 | [x] |
| **REQ-HOST-004** | Listener `onSnapshot` activo sobre `/users/{uid}` | Fase 3 | TASK-3.4 | [x] |
| **REQ-HOST-005** | Revocación y expulsión multi-pestaña ante `INACTIVE` o `role_id` nulo | Fase 3 | TASK-3.4, TASK-3.5 | [x] |
| **REQ-HOST-006** | Consulta y carga dinámica del manifiesto `/config/microfrontends` | Fase 4 | TASK-4.1, TASK-4.3 | [x] |
| **REQ-HOST-007** | Validación de acceso por `DynamicRemoteGuard` (`active` y `rolesAllowed`) | Fase 4 | TASK-4.2 | [x] |
| **REQ-HOST-008** | Fallback a `EmptyStateCardComponent` si el módulo está inactivo | Fase 2, 4 | TASK-2.2, TASK-4.2 | [x] |
| **REQ-HOST-009** | Filtrado dinámico en `SidebarNavigationComponent` de módulos activos | Fase 2, 4 | TASK-2.3, TASK-4.4 | [x] |
| **REQ-HOST-010** | Toggle de tema en `HeaderUserBarComponent` y persistencia en `localStorage` | Fase 2, 5 | TASK-2.1, TASK-2.3, TASK-5.1 | [x] |
| **REQ-HOST-011** | Inyección reactiva de clase `.dark` en elemento raíz `<html>` | Fase 5 | TASK-5.1, TASK-5.2 | [x] |

---

## Leyenda de Estados
- `[ ]` **Pendiente**: Tarea especificada, lista para comenzar.
- `[/]` **En progreso**: Tarea en desarrollo activo.
- `[x]` **Completada**: Tarea finalizada y validada con criterios de aceptación cumplidos.

---

## Desglose de Fases de Implementación

### Fase 1: Configuración de Entorno, Shell Angular 20 y Native Federation
> **Objetivo**: Establecer los cimientos del Shell Host con soporte para Standalone components, Tailwind CSS y el empaquetador de Native Federation.  
> **Trazabilidad**: `REQ-HOST-001`, `CONSTITUTION.md` §3, `PLAN.md` §1.2, §2.2

- [x] **TASK-1.1**: Configuración base de proyecto Angular 20 Standalone y Tailwind CSS maestro.
  - **Archivos**: `package.json`, `angular.json`, `tailwind.config.js`, `src/styles.css`
  - **Criterio de Aceptación (DoD)**: El proyecto compila sin errores y Tailwind procesa la paleta corporativa `brand` y clase `.dark`.
- [x] **TASK-1.2**: Configuración de Native Federation en `federation.config.js`.
  - **Archivos**: `federation.config.js`
  - **Criterio de Aceptación (DoD)**: `shareAll` configurado como `singleton: true`, `strictVersion: true`, ignorando módulos RxJS secundarios.
- [x] **TASK-1.3**: Configuración de Firebase SDK y variables de entorno.
  - **Archivos**: `src/environments/environment.ts`, `src/environments/environment.prod.ts`, `src/app/app.config.ts`
  - **Criterio de Aceptación (DoD)**: `provideFirebaseApp`, `provideAuth` y `provideFirestore` inyectados en `app.config.ts`.

---

### Fase 2: Implementación del Sistema de Diseño Atómico (Capa Shared)
> **Objetivo**: Crear componentes reutilizables aislados que sirvan de base para el Shell y los módulos federados.  
> **Trazabilidad**: `REQ-HOST-002`, `REQ-HOST-003`, `REQ-HOST-008`, `REQ-HOST-010`, `PLAN.md` §2.5

- [x] **TASK-2.1**: Implementación de Átomos.
  - **Componentes**:
    - `GoogleButtonComponent`: Botón oficial con isotipo de Google y estado `loading`.
    - `ButtonComponent`: Botón estándar con variantes (`primary`, `secondary`, `danger`, `outline`).
    - `InputComponent`: Campo de texto accesible con soporte para estados de error.
    - `SpinnerComponent`: Indicador animado SVG de carga.
    - `ToggleComponent`: Switch interactivo para alternar tema claro/oscuro.
  - **Archivos**: `src/app/shared/components/atomics/*`
  - **Criterio de Aceptación (DoD)**: Cada componente cuenta con inputs fuertemente tipados con Signals y estilos Tailwind responsivos.
- [x] **TASK-2.2**: Implementación de Moléculas.
  - **Componentes**:
    - `AlertComponent`: Alerta con variantes semánticas (`info`, `success`, `warning`, `danger`) para notificación de errores Zero-Trust.
    - `UserProfileComponent`: Avatar, nombre del usuario autenticado y rol activo.
    - `NavItemComponent`: Enlace de navegación con icono, label y estado activo.
    - `EmptyStateCardComponent`: Vista para módulos inactivos por Kill Switch o en mantenimiento.
  - **Archivos**: `src/app/shared/components/molecules/*`
  - **Criterio de Aceptación (DoD)**: `AlertComponent` soporta renderizado dinámico del mensaje y `EmptyStateCardComponent` muestra mensaje informativo de mantenimiento.
- [x] **TASK-2.3**: Implementación de Organismos.
  - **Componentes**:
    - `SidebarNavigationComponent` / `MenuComponent`: Menú lateral que lista únicamente microfrontends activos.
    - `HeaderUserBarComponent` / `LayoutComponent`: Barra superior con `UserProfileComponent` y `ToggleComponent` de tema.
  - **Archivos**: `src/app/shared/components/organism/*`, `src/app/layout/*`
  - **Criterio de Aceptación (DoD)**: Organismos desacoplados de lógica de negocio, alimentados mediante `@Input()` Signals o servicios core inyectados.
- [x] **TASK-2.4**: Implementación de Plantillas y Páginas Principales.
  - **Componentes**:
    - `LoginPageComponent`: Layout centrado con presentación corporativa, contenedor de alertas `AlertComponent` (`danger`) y `GoogleButtonComponent`.
    - `ShellDashboardPageComponent`: Contenedor principal con header, sidebar y router-outlet.
  - **Archivos**: `src/app/pages/auth/login-page.component.ts`, `src/app/pages/dashboard/dashboard.component.ts`
  - **Criterio de Aceptación (DoD)**: La página de login presenta la alerta de error cuando la redirección proviene de un rechazo Zero-Trust.

---

### Fase 3: Core de Autenticación, Zero-Trust y Gobernanza en Tiempo Real
> **Objetivo**: Implementar el protocolo Zero-Trust inflexible y la escucha en tiempo real de revocación de sesiones.  
> **Trazabilidad**: `REQ-HOST-002`, `REQ-HOST-003`, `REQ-HOST-004`, `REQ-HOST-005`, `CONSTITUTION.md` §2.1, §2.3, `PLAN.md` §2.1, §3

- [x] **TASK-3.1**: Flujo de inicio de sesión con Google OAuth en `AuthService`.
  - **Archivo**: `src/app/core/auth/auth.service.ts`
  - **Acción**: Conectar `GoogleAuthProvider` y `signInWithPopup(auth, provider)` exponiendo Signals `isLoading` y `authError`.
  - **Criterio de Aceptación (DoD)**: Al hacer click en `GoogleButtonComponent`, se abre el popup de Google y devuelve el token de Firebase Auth.
- [x] **TASK-3.2**: Verificación Zero-Trust de documento `/users/{uid}` en Firestore.
  - **Archivo**: `src/app/core/auth/auth.service.ts`, `src/app/core/models/user.model.ts`
  - **Acción**: Tras la autenticación con Google, consultar el documento `doc(firestore, 'users', uid)`.
  - **Validación**:
    - El documento debe existir.
    - `role_id` debe ser no nulo y válido.
    - `team_id` debe ser no nulo.
    - `status` debe ser `'ACTIVE'`.
  - **Criterio de Aceptación (DoD)**: Si la validación pasa, se establece `currentUser` con su rol y equipo asignados.
- [x] **TASK-3.3**: Protocolo de Expulsión Zero-Trust e Invocación de Alerta.
  - **Archivos**: `src/app/core/auth/auth.service.ts`, `src/app/pages/auth/login-page.component.ts`, `src/app/shared/components/organism/login-card.component.ts`
  - **Acción**: Si falla la verificación de `role_id`, `team_id` o `status`:
    1. Ejecutar `signOut(auth)`.
    2. Purgar estado de sesión en memoria (`currentUser.set(null)`).
    3. Redirigir hacia `/login` con parámetro o estado de alerta.
    4. Renderizar `AlertComponent` en estado `danger` con el mensaje: *"Acceso Denegado: Tu cuenta no tiene un rol asignado. Contacta a tu Líder o Administrador."*
  - **Criterio de Aceptación (DoD)**: Ningún usuario sin documento/rol en Firestore puede ver o permanecer en rutas protegidas.
- [x] **TASK-3.4**: Listener reactivo `onSnapshot` sobre `/users/{uid}`.
  - **Archivo**: `src/app/core/auth/auth.service.ts`
  - **Acción**: Mantener una suscripción `onSnapshot` activa mientras el usuario tenga sesión abierta.
  - **Criterio de Aceptación (DoD)**: Si en Firestore cambia `status` a `'INACTIVE'` o se borra el `role_id`, el listener invoca inmediatamente `signOut()` y expulsa al usuario hacia el login en todas las ventanas abiertas.
- [x] **TASK-3.5**: Implementación de `AuthGuard` e `AuthInterceptor`.
  - **Archivos**: `src/app/core/auth/guards/auth.guard.ts`, `src/app/core/auth/auth.interceptor.ts`
  - **Acción**:
    - `authGuard`: Bloquear rutas si `isAuthenticated()` es falso, rol (`role_id`) ausente o `status !== 'ACTIVE'`.
    - `authInterceptor`: Agregar cabecera `Authorization: Bearer <ID_TOKEN>` a peticiones HTTP hacia servicios autorizados.
  - **Criterio de Aceptación (DoD)**: Las rutas hijas de `/` quedan protegidas y las peticiones HTTP llevan el token inyectado.

---

### Fase 4: Carga Dinámica de Microfrontends y Kill Switch
> **Objetivo**: Integrar la consulta dinámica del catálogo de microfrontends en Firestore y proteger las rutas remotas.  
> **Trazabilidad**: `REQ-HOST-006`, `REQ-HOST-007`, `REQ-HOST-008`, `REQ-HOST-009`, `CONSTITUTION.md` §2.2, `PLAN.md` §2.3, §4

- [x] **TASK-4.1**: Servicio de Manifiesto Remoto (`RemoteManifestService`).
  - **Archivo**: `src/app/core/services/remote-manifest.service.ts`, `src/app/core/models/microfrontend.model.ts`
  - **Acción**: Consultar la colección `/config/microfrontends` de Firestore y exponer la lista mediante `signal<MicrofrontendConfig[]>`.
  - **Criterio de Aceptación (DoD)**: Al arrancar la sesión, el servicio obtiene la lista ordenada de microfrontends registrados.
- [x] **TASK-4.2**: Guard Dinámico de Módulos Remotos (`DynamicRemoteGuard`).
  - **Archivo**: `src/app/core/guards/dynamic-remote.guard.ts`
  - **Acción**: Evaluar al navegar a una ruta remota:
    - ¿El microfrontend tiene `active === true`? Si es `false`, redirigir o renderizar `EmptyStateCardComponent` (Módulo Fuera de Servicio).
    - ¿El `role` del usuario está incluido en `rolesAllowed`? Si no, denegar acceso.
  - **Criterio de Aceptación (DoD)**: Si se desactiva un microfrontend en Firestore, la navegación queda bloqueada perimetralmente.
- [x] **TASK-4.3**: Configuración de Rutas Dinámicas con `loadRemoteModule` en `app.routes.ts`.
  - **Archivo**: `src/app/app.routes.ts`
  - **Acción**: Integrar `@angular-architects/native-federation` para carga diferida de remotos federados con protección de `authGuard` y `dynamicRemoteGuard`.
  - **Criterio de Aceptación (DoD)**: Los microfrontends se cargan perezosamente solo al acceder a su ruta correspondiente.
- [x] **TASK-4.4**: Filtrado dinámico en el Menú lateral / Sidebar.
  - **Archivo**: `src/app/layout/layout.component.ts`, `src/app/layout/layout.component.html`
  - **Acción**: Conectar el menú con `RemoteManifestService` mostrando exclusivamente aquellos ítems que tengan `active === true` y permisos para el rol del usuario.
  - **Criterio de Aceptación (DoD)**: Un microfrontend con `active: false` desaparece inmediatamente del menú lateral.

---

### Fase 5: Tema Oscuro y Persistencia Visual (Zero Network Cost)
> **Objetivo**: Proveer alternancia instantánea entre modo claro y oscuro con persistencia local en el navegador.  
> **Trazabilidad**: `REQ-HOST-010`, `REQ-HOST-011`, `CONSTITUTION.md` §2.4, `PLAN.md` §2.4

- [x] **TASK-5.1**: Implementación de `ThemeService`.
  - **Archivo**: `src/app/core/services/theme.service.ts`
  - **Acción**:
    - Leer `localStorage.getItem('sistema_theme')` al iniciar (default `'dark'`).
    - Exponer señal `currentTheme = signal<'light' | 'dark'>(...)`.
    - Método `toggleTheme()` que invierte el estado y actualiza `localStorage`.
  - **Criterio de Aceptación (DoD)**: El tema persiste entre recargas de página sin realizar llamadas HTTP a red.
- [x] **TASK-5.2**: Sincronización reactiva de clase `.dark` en elemento raíz `<html>`.
  - **Archivo**: `src/app/core/services/theme.service.ts`, `src/index.html`
  - **Acción**:
    - Configurar un `effect()` en `ThemeService` para añadir o remover la clase `.dark` en `document.documentElement`.
    - Script inline preventivo en `index.html` para evitar parpadeo en la carga inicial (FOUC).
  - **Criterio de Aceptación (DoD)**: La clase `.dark` está presente en `<html>` si y solo si el tema actual es `'dark'`.
- [x] **TASK-5.3**: Conexión del `ToggleComponent` en la barra superior del Layout.
  - **Archivo**: `src/app/layout/layout.component.ts`, `src/app/layout/layout.component.html`
  - **Acción**: Enlazar el evento `changed` del toggle con `themeService.setTheme(...)`.
  - **Criterio de Aceptación (DoD)**: Al hacer click en el toggle se intercambia el tema visual inmediatamente.

---

### Fase 6: Pruebas Unitarias, Integración y Build de Producción
> **Objetivo**: Asegurar la calidad, estabilidad y cumplimiento de contratos del Shell Host.  
> **Trazabilidad**: `PLAN.md` §4, `CONSTITUTION.md` §2

- [x] **TASK-6.1**: Pruebas unitarias para `AuthService` y Zero-Trust.
  - **Archivo**: `src/app/core/auth/auth.service.spec.ts`
  - **Casos de Prueba**:
    - Inicialización de estado desacoplado.
    - Rechazo Zero-Trust con expulsión inmediata y mensaje de alerta.
    - Limpieza de sesión en logout.
  - **Criterio de Aceptación (DoD)**: Pruebas unitarias escritas y estructuradas según Jasmine/Karma.
- [x] **TASK-6.2**: Pruebas unitarias para `ThemeService` y `DynamicRemoteGuard`.
  - **Archivos**: `src/app/core/services/theme.service.spec.ts`, `src/app/core/guards/dynamic-remote.guard.spec.ts`
  - **Casos de Prueba**:
    - Alternancia de tema y escritura en `localStorage`.
    - Bloqueo de navegación cuando `active: false` (Kill Switch).
    - Bloqueo perimetral cuando el rol no está permitido en `rolesAllowed`.
    - Aprobación cuando el módulo está activo y el rol coincide.
  - **Criterio de Aceptación (DoD)**: Todas las pruebas unitarias de guard y tema cubren los casos de especificación.
- [x] **TASK-6.3**: Verificación de compilación de producción.
  - **Comando**: `npm run build`
  - **Criterio de Aceptación (DoD)**: Generación exitosa de bundles de producción sin errores de tipos TypeScript ni advertencias críticas de Native Federation.
