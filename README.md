# Mi Sistema - Host (Repositorio Independiente / Polyrepo)

Repositorio principal de la aplicación **Host (`sistema-host`)**, desarrollada en **Angular 20**, **Native Federation**, **Tailwind CSS v3.4** y servicios de **Firebase**.

Este proyecto funciona bajo una arquitectura **Polyrepo (Multi-repo)**: este repositorio contiene **únicamente el cascarón Host**. Los microfrontends pilares (como `administracion`, `ventas`, etc.) se desarrollarán y desplegarán en **sus propios repositorios independientes de Git**.

---

## 🏛️ Estructura del Repositorio Host

```text
mi-sistema/ (Repositorio del Host)
├── src/                               # Código fuente exclusivo del Host
│   ├── app/
│   │   ├── app.ts                     # Componente raíz
│   │   ├── app.html                   # Router outlet principal
│   │   ├── app.routes.ts              # Enrutador dinámico que carga los remotos
│   │   ├── app.config.ts              # Proveedores de la aplicación
│   │   ├── layout/                    # 🎨 Cascarón del Host (Navbar superior + Sidebar)
│   │   │   ├── layout.component.ts
│   │   │   ├── layout.component.html
│   │   │   └── layout.component.css
│   │   ├── pages/
│   │   │   ├── dashboard/             # Vista principal del Host
│   │   │   └── fallback/              # Vista de contingencia si un remoto no está activo
│   │   └── shared/                    # 🧩 Biblioteca compartida con Diseño Atómico
│   │       ├── index.ts               # Barrel export general de shared
│   │       └── components/            # Componentes reutilizables del sistema
│   │           ├── index.ts           # Barrel export de componentes
│   │           ├── atomics/           # ⚛️ Átomos (badge, button, avatar, icon)
│   │           ├── molecules/         # 🧬 Moléculas (stat-card, user-profile, nav-item)
│   │           └── organism/          # 🫀 Organismos (welcome-banner, empty-state-card)
│   ├── bootstrap.ts                   # Inicializador asíncrono de Native Federation
│   ├── main.ts                        # Entry point
│   ├── styles.css                     # Directivas globales de Tailwind CSS
│   └── environments/                  # Variables de entorno y configuración de Firebase
│       ├── environment.ts
│       └── environment.development.ts
├── public/
│   ├── favicon.ico
│   └── federation.manifest.json       # 🗺️ Mapeo a las URLs de los repositorios remotos
├── angular.json                       # Configuración de compilación esbuild + Native Federation
├── package.json                       # Dependencias globales del Host
├── tailwind.config.js                 # Configuración de estilos y tema brand
├── postcss.config.js                  # Configuración de PostCSS
├── federation.config.js               # Dependencias compartidas (shareAll, singleton)
└── tsconfig.json                      # Configuración de TypeScript
```

---

## 🎨 Estándar de Diseño del Sistema (`tailwind.config.js`)

> **Regla de Oro de Diseño**: Todo el diseño, estilos, componentes y vistas del ecosistema (`mi-sistema` y futuros microfrontends remotos) **deben adherirse estrictamente a los tokens centralizados definidos en `tailwind.config.js`**. Se prohíbe el uso de valores hexadecimales o dimensiones arbitrarias (`h-[37px]`, `text-[#123456]`, etc.) en clases inline.

Todos los estilos visuales nacen de los tokens estándar configurados en [`tailwind.config.js`](tailwind.config.js):

### 1. 🌈 Paleta de Colores Semántica
- **`brand` (`50` - `950`)**: Color primario del sistema (tonalidades Sky / Deep Blue corporativo). Acciones principales, barras destacadas, logos y navegación activa.
- **`accent` (`50` - `950`)**: Acento complementario (Indigo moderno). Estados de foco, detalles secundarios o llamados a la acción complementarios.
- **`surface` (`50` - `950`)**: Grises semánticos (`Slate`). Fondos (`surface-50`), bordes y divisores (`surface-200` / `surface-300`), textos secundarios (`surface-500`) y títulos (`surface-900`).
- **`feedback`**: Estados del sistema:
  - `feedback-success` (`light`, `DEFAULT`, `dark`, `border`)
  - `feedback-warning` (`light`, `DEFAULT`, `dark`, `border`)
  - `feedback-danger` (`light`, `DEFAULT`, `dark`, `border`)
  - `feedback-info` (`light`, `DEFAULT`, `dark`, `border`)

### 2. 🔤 Tipografía y Jerarquía
- **Familias**:
  - `font-sans`: **Inter** (`'Inter', system-ui, sans-serif`) para interfaces legibles y limpias.
  - `font-mono`: **JetBrains Mono** (`'JetBrains Mono', monospace`) para código, rutas y métricas técnicas.
- **Escala de tamaños**:
  - `text-2xs` (11px, `0.6875rem`): Badges compactos y pies de notas.
  - `text-xs` (12px): Etiquetas y micro-copys.
  - `text-sm` (14px): Texto estándar de navegación y lectura UI.
  - `text-base` (16px): Lectura general y títulos de tarjetas.
  - `text-lg` a `text-4xl`: Títulos y banners con tracking optimizado.

### 3. 📐 Espaciados y Dimensiones
- **Espaciados estándar**: Escala completa de Tailwind reforzada con valores comunes de interfaces: `4.5` (18px), `13` (52px), `15` (60px), `18` (72px), `68` (272px), `88` (352px).

### 4. 🔲 Bordes y Radios (`borderRadius`)
- `rounded-xs` (4px), `rounded-sm` (6px): Pequeños chips o indicadores.
- `rounded-md` (8px), `rounded-lg` (12px): Botones, inputs y menús dropdown.
- `rounded-xl` (16px), `rounded-2xl` (20px): Tarjetas estadísticas, paneles y banners principales.
- `rounded-full`: Avatares y pastillas de estado completas.

### 5. ⛅ Elevación y Sombras (`boxShadow`)
- `shadow-subtle`: Sombra tenue para botones secundarios o divisores suaves.
- `shadow-card`: Elevación estándar para tarjetas en reposo.
- `shadow-card-hover`: Elevación interactiva al hacer hover sobre tarjetas clickeables.
- `shadow-dropdown`: Menús desplegables y context-menus.
- `shadow-modal`: Diálogos y ventanas modales flotantes.
- `shadow-glow-brand` / `shadow-glow-accent`: Efecto resplandor sutil para elementos activos destacados.

### 6. ⚡ Transiciones y Animaciones
- **Duraciones**: `duration-fast` (150ms), `duration-normal` (250ms), `duration-slow` (400ms).
- **Curvas de aceleración**: `ease-smooth` (`cubic-bezier(0.4, 0, 0.2, 1)`) y `ease-bounce-subtle` (`cubic-bezier(0.34, 1.56, 0.64, 1)`).
- **Animaciones preconfiguradas**:
  - `animate-fade-in`: Entrada suave de vistas y componentes.
  - `animate-scale-in`: Aparición de modales o badges emergentes.
  - `animate-slide-down`: Despliegue de menús.
  - `animate-pulse-subtle`: Indicador de estado en vivo / online.

---

## 🧩 Estrategia de Diseño Atómico (Atomic Design)

Toda la interfaz y los componentes visuales reutilizables del proyecto se estructuran bajo los principios de **Atomic Design** dentro de `src/app/shared/components/`.

> **Regla de Arquitectura**: Cada nuevo componente visual que se utilice en el proyecto debe crearse en su respectivo nivel atómico dentro de `shared/components/` y ser consumido desde allí en el cascarón (`layout`), páginas (`pages`), o expuesto a otros módulos.

```
shared/components/
├── atomics/    # ⚛️ Átomos: Bloques fundamentales indivisibles
├── molecules/  # 🧬 Moléculas: Combinación de 2 o más átomos con un propósito funcional
└── organism/   # 🫀 Organismos: Estructuras complejas y autónomas compuestas por moléculas y átomos
```

### 1. ⚛️ Átomos (`src/app/shared/components/atomics`)
Son los bloques fundamentales e indivisibles de la interfaz de usuario. No pueden subdividirse sin perder su funcionalidad básica:

| Componente | Selector | Descripción | Inputs principales |
| :--- | :--- | :--- | :--- |
| **`BadgeComponent`** | `app-badge` | Etiquetas de estado, tags y píldoras visuales | `variant`, `size`, `dot`, `pulse` |
| **`ButtonComponent`** | `app-button` | Botones de acción estándar e iconos | `variant`, `size`, `disabled`, `type` |
| **`AvatarComponent`** | `app-avatar` | Avatar para usuarios con iniciales o imagen | `initials`, `src`, `size`, `alt` |
| **`IconComponent`** | `app-icon` | Renderizador vectorial de iconos del sistema | `name`, `size`, `customClass` |

### 2. 🧬 Moléculas (`src/app/shared/components/molecules`)
Son agrupaciones de átomos que funcionan juntos como una unidad funcional específica:

| Componente | Selector | Átomos usados | Descripción |
| :--- | :--- | :--- | :--- |
| **`StatCardComponent`** | `app-stat-card` | `app-badge`, `app-icon` | Tarjeta informativa con métrica/estado y pie |
| **`UserProfileComponent`**| `app-user-profile` | `app-avatar` | Píldora de perfil con avatar, nombre y correo |
| **`NavItemComponent`** | `app-nav-item` | `app-icon`, `app-badge` | Enlace de navegación con icono, etiqueta y badge |

### 3. 🫀 Organismos (`src/app/shared/components/organism`)
Estructuras más complejas y de mayor escala que integran moléculas y átomos para formar secciones completas de interfaz:

| Componente | Selector | Composición | Descripción |
| :--- | :--- | :--- | :--- |
| **`WelcomeBannerComponent`** | `app-welcome-banner` | Degradado, chips y texto | Banner destacado de bienvenida y estado |
| **`EmptyStateCardComponent`** | `app-empty-state-card`| `app-icon`, slot para código | Tarjeta punteada para slots vacíos o siguientes pasos |

### 4. 📐 Plantillas y Páginas (`layout/` y `pages/`)
Es el nivel superior donde se ensamblan los componentes de `shared`:
- **`LayoutComponent` (`src/app/layout/`)**: Utiliza `app-button`, `app-badge`, `app-user-profile` y `app-nav-item` para renderizar el navbar y el sidebar interactivo.
- **`DashboardComponent` (`src/app/pages/dashboard/`)**: Utiliza `app-welcome-banner`, `app-stat-card` y `app-empty-state-card` para presentar la vista del host.

### 📦 Cómo Consumir Componentes desde `shared/components`

Todos los componentes son **Standalone Components de Angular 20** y se pueden importar directamente desde los barriles (`index.ts`):

```typescript
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// Importación desde shared/components
import { BadgeComponent, ButtonComponent } from '../../shared/components/atomics';
import { StatCardComponent } from '../../shared/components/molecules';
import { WelcomeBannerComponent } from '../../shared/components/organism';

@Component({
  selector: 'app-mi-vista',
  standalone: true,
  imports: [
    CommonModule,
    BadgeComponent,
    ButtonComponent,
    StatCardComponent,
    WelcomeBannerComponent
  ],
  template: `
    <app-welcome-banner title="Mi Vista" chipText="Versión 1.0">
      Bienvenido a la vista modular.
    </app-welcome-banner>

    <app-stat-card
      title="Módulo de Ventas"
      description="Reportes y facturación mensual"
      badgeText="Conectado"
      badgeVariant="success"
      iconName="dashboard"
    ></app-stat-card>
  `
})
export class MiVistaComponent {}
```

---

## 🚀 Comandos del Host

### Servidor de Desarrollo
Inicia el Host en `http://localhost:4200`:
```bash
npm start
```

### Compilación para Producción
Compila el Host con el builder de **Native Federation + esbuild**:
```bash
npm run build
```

---

## 🔌 Cómo Conectar el Segundo Repositorio (`administracion`)

Dado que cada microfrontend vive en su propio repositorio:

### 1. En el nuevo repositorio `administracion`:
Crea el proyecto en su propia carpeta/repo:
```bash
# 1. Crear nuevo proyecto standalone Angular 20
npx -y @angular/cli@20 new administracion --routing --style=css

# 2. Entrar a su repositorio
cd administracion

# 3. Configurar Native Federation como REMOTE en el puerto 4201
npx ng add @angular-architects/native-federation --project=administracion --port=4201 --type=remote
```

### 2. Exponer el módulo o rutas en `administracion/federation.config.js`:
Dentro del archivo `federation.config.js` del repositorio de `administracion`, asegúrate de exponer sus rutas o componentes:
```javascript
const { withNativeFederation, shareAll } = require('@angular-architects/native-federation/config');

module.exports = withNativeFederation({
  name: 'administracion',

  // Exponer el archivo de rutas para que el Host lo consuma
  exposes: {
    './routes': './src/app/app.routes.ts',
  },

  shared: {
    ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }),
  }
});
```

### 3. En este repositorio Host (`sistema-host`):
El Host ya se encuentra configurado y listo:

- **Manifiesto ([`public/federation.manifest.json`](public/federation.manifest.json)):**
  ```json
  {
    "administracion": "http://localhost:4201/remoteEntry.json"
  }
  ```
  *(En producción, aquí colocarás la URL donde esté desplegado administracion, ej: `https://admin.misistema.com/remoteEntry.json`)*.

- **Rutas dinámicas ([`src/app/app.routes.ts`](src/app/app.routes.ts)):**
  Carga el módulo remoto de forma perezosa (lazy) con tolerancia a fallos:
  ```typescript
  {
    path: 'administracion',
    loadChildren: () =>
      loadRemoteModule('administracion', './routes')
        .then(m => m.routes)
        .catch(err => {
          console.warn('Microfrontend administracion no disponible:', err);
          return import('./pages/fallback/remote-fallback.component').then(m => m.FALLBACK_ROUTES);
        })
  }
  ```

---

## 🔥 Configuración de Firebase en el Host

Las librerías `@angular/fire` y `firebase` están instaladas en este repositorio.
Para conectar tu proyecto de Firebase, coloca tus credenciales en [`src/environments/environment.ts`](src/environments/environment.ts).
