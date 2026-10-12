# Constitución del Repositorio: SISTEMA Host

## 1. Propósito del Repositorio

`SISTEMA Host` es el contenedor principal (Shell) del ecosistema Polyrepo. Es responsable de la autenticación centralizada (Google OAuth), el control de acceso Zero-Trust, la carga dinámica de microfrontends vía Native Federation, la maquetación global y la distribución del estado de sesión hacia los módulos remotos.

---

## 2. Principios e Invariantes Técnicas

1. **Autenticación Exclusiva e Inflexible**:
   - Únicamente se permite Google OAuth como proveedor de identidad.
   - El acceso es **Zero-Trust**: Si un usuario autenticado no posee un documento en `/users/{uid}` con un `role_id` y `team_id` válidos asignados por un Administrador, el Host DEBE cerrar la sesión de inmediato, destruir los tokens y redirigirlo a la pantalla de login con un mensaje de alerta.

2. **Carga Dinámica y "Kill Switch" de Microfrontends**:
   - Las URLs y estados de activación de los microfrontends remotos no están codificados de forma rígida; se obtienen en tiempo real desde Firestore (`/config/microfrontends`).
   - El Host DEBE ocultar del menú y bloquear el acceso mediante Guards a cualquier microfrontend cuyo estado sea `active: false`.

3. **Gobernanza de Sesión en Tiempo Real**:
   - El Host debe mantener una conexión activa `onSnapshot` sobre `/users/{uid}`. Si el estado cambia a `INACTIVE` o el `role_id` se revoca (`null`), la sesión se expulsa de inmediato en todas las pestañas abiertas.

4. **Persistencia Visual sin Costo de Red**:
   - La preferencia de tema (`light` | `dark`) se gestiona localmente en `localStorage` (`sistema_theme`) alternando la clase `.dark` en el elemento raíz `<html>`.

---

## 3. Estructura de Directorios

El repositorio sigue la arquitectura canónica de Angular 20 definida en `ARCHITECTURE.md`:

```text
host/ 
├── src/ 
│   ├── app/ 
│   │   ├── core/ 
│   │   │   ├── auth/          # AuthService (@sistema/auth), AuthInterceptor, Custom Claims 
│   │   │   ├── guards/        # AuthGuard, RoleGuard, DynamicRemoteGuard 
│   │   │   ├── models/        # User, Team, MicrofrontendConfig Interfaces 
│   │   │   └── services/      # ThemeService, RemoteManifestService 
│   │   ├── shared/ 
│   │   │   └── components/    # Catálogo Atómico (atoms, molecules, organism) 
│   │   └── pages/ 
│   │       ├── auth/          # LoginPageComponent 
│   │       ├── dashboard/     # ShellDashboardPageComponent 
│   │       └── [feature-pages]/ # Vistas adaptativas según la necesidad del Host 
│   ├── environments/ 
│   ├── styles.css             # Estándar transversal CSS puro de Tailwind 
│   ├── tailwind.config.js 
│   └── federation.config.js 
├── CONSTITUTION.md 
├── SPEC.md 
├── PLAN.md 
└── TASKS.md 
```