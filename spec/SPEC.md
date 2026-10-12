# Especificación Técnica (SPEC) - SISTEMA Host

Este documento establece los requerimientos funcionales del Shell Host utilizando sintaxis estricta EARS (*Easy Approach to Requirements Syntax*).

---

## 1. Autenticación y Control de Acceso Zero-Trust

- **REQ-HOST-001 (Ubicuo)**: El sistema deberá utilizar la versión 20 de Angular con componentes Standalone y `@angular-architects/native-federation`.
- **REQ-HOST-002 (Event-Driven)**: Cuando el usuario presione el componente `GoogleButtonComponent`, el `AuthService` deberá iniciar el flujo de autenticación emergente (*popup*) de Google OAuth via Firebase Auth.
- **REQ-HOST-003 (Unwanted Behavior / Excepción)**: Si un usuario se autentica exitosamente con Google pero su registro en Firestore (`/users/{uid}`) no contiene un `role_id` válido o un `team_id` asignado, entonces el `AuthGuard` deberá ejecutar `firebase.auth().signOut()`, purgar el almacenamiento de sesión, redirigir a `/auth/login` y mostrar la molécula `AlertComponent` en estado `danger` con el mensaje: *"Acceso Denegado: Tu cuenta no tiene un rol asignado. Contacta a tu Líder o Administrador."*
- **REQ-HOST-004 (State-Driven)**: Mientras el usuario esté autenticado y activo en la plataforma, el `AuthService` deberá mantener un listener `onSnapshot` sobre su documento en Firestore `/users/{uid}`.
- **REQ-HOST-005 (Event-Driven)**: Cuando el listener `onSnapshot` detecte que el campo `status` ha cambiado a `INACTIVE` o que el `role_id` ha sido revocado (`null`), el sistema deberá revocar la sesión inmediatamente en el navegador y redirigir a la pantalla de inicio de sesión.

---

## 2. Carga Dinámica de Microfrontends (Manifest Managment)

- **REQ-HOST-006 (State-Driven)**: Mientras la aplicación Host se encuentre en proceso de inicialización, el `RemoteManifestService` deberá consultar la colección `/config/microfrontends` en Firestore para construir el mapa dinámico de rutas remotas.
- **REQ-HOST-007 (Event-Driven)**: Cuando un usuario intente navegar hacia una ruta remota (ej. `/mapeo`, `/gestion`), el `DynamicRemoteGuard` deberá verificar que la microapp correspondiente tenga la propiedad `active: true` y que el `role_id` del usuario esté incluido en `rolesAllowed`.
- **REQ-HOST-008 (Unwanted Behavior / Excepción)**: Si un usuario intenta acceder a una microapp con estado `active: false`, entonces el `DynamicRemoteGuard` deberá cancelar la navegación y renderizar el componente `EmptyStateCardComponent` informando que el módulo se encuentra fuera de servicio o en mantenimiento.
- **REQ-HOST-009 (State-Driven)**: Mientras el sidebar `SidebarNavigationComponent` esté visible, el sistema deberá filtrar dinámicamente los ítems del menú mostrando únicamente los microfrontends marcados como `active: true` en Firestore.

---

## 3. Sistema de Diseño y Gestión de Tema (Dark Mode)

- **REQ-HOST-010 (Event-Driven)**: Cuando el usuario interactúe con el `ToggleComponent` de tema en el `HeaderUserBarComponent`, el `ThemeService` deberá alternar el valor en `localStorage` bajo la clave `sistema_theme` (`light` | `dark`).
- **REQ-HOST-011 (State-Driven)**: Mientras el valor de `sistema_theme` sea `dark`, el `ThemeService` deberá asegurar la presencia de la clase `.dark` en el elemento raíz `<html>` del documento DOM.