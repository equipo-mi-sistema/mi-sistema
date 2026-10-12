import { Injectable, inject, signal, computed } from '@angular/core';
import { Firestore, doc, getDoc, collection, getDocs } from '@angular/fire/firestore';
import { MicrofrontendConfig } from '../models/microfrontend.model';

export const DEFAULT_MICROFRONTENDS: MicrofrontendConfig[] = [
  {
    id: 'administracion',
    name: 'Administración',
    routePath: 'administracion',
    remoteEntry: 'http://localhost:4201/remoteEntry.json',
    exposedModule: './routes',
    active: true,
    rolesAllowed: ['SUPER_ADMIN', 'ADMIN'],
    icon: 'extension',
    order: 1,
    badge: 'Remoto'
  },
  {
    id: 'mapeo',
    name: 'Mapeo Territorial',
    routePath: 'mapeo',
    remoteEntry: 'http://localhost:4202/remoteEntry.json',
    exposedModule: './routes',
    active: false,
    rolesAllowed: ['SUPER_ADMIN', 'ADMIN', 'LEADER'],
    icon: 'map',
    order: 2,
    badge: 'Próximamente'
  },
  {
    id: 'gestion',
    name: 'Gestión Ciudadana',
    routePath: 'gestion',
    remoteEntry: 'http://localhost:4203/remoteEntry.json',
    exposedModule: './routes',
    active: false,
    rolesAllowed: ['SUPER_ADMIN', 'ADMIN', 'LEADER'],
    icon: 'users',
    order: 3,
    badge: 'Próximamente'
  },
  {
    id: 'asistencia',
    name: 'Asistencia y Eventos',
    routePath: 'asistencia',
    remoteEntry: 'http://localhost:4204/remoteEntry.json',
    exposedModule: './routes',
    active: false,
    rolesAllowed: ['SUPER_ADMIN', 'ADMIN', 'OPERATOR'],
    icon: 'calendar',
    order: 4,
    badge: 'Próximamente'
  },
  {
    id: 'transporte',
    name: 'Logística y Transporte',
    routePath: 'transporte',
    remoteEntry: 'http://localhost:4205/remoteEntry.json',
    exposedModule: './routes',
    active: false,
    rolesAllowed: ['SUPER_ADMIN', 'ADMIN', 'OPERATOR'],
    icon: 'truck',
    order: 5,
    badge: 'Próximamente'
  },
  {
    id: 'conteo',
    name: 'Escrutinio y Conteo E-14',
    routePath: 'conteo',
    remoteEntry: 'http://localhost:4206/remoteEntry.json',
    exposedModule: './routes',
    active: false,
    rolesAllowed: ['SUPER_ADMIN', 'ADMIN', 'OPERATOR'],
    icon: 'chart',
    order: 6,
    badge: 'Próximamente'
  }
];

@Injectable({
  providedIn: 'root'
})
export class RemoteManifestService {
  private readonly firestore: Firestore = inject(Firestore);

  // Lista reactiva de microfrontends registrados
  readonly configs = signal<MicrofrontendConfig[]>(DEFAULT_MICROFRONTENDS);
  readonly isLoading = signal<boolean>(false);

  // Señal computada para filtrar microfrontends activos (Kill Switch)
  readonly activeConfigs = computed(() =>
    this.configs()
      .filter((config) => config.active)
      .sort((a, b) => a.order - b.order)
  );

  constructor() {
    this.loadManifest();
  }

  /**
   * Consulta Firestore (/config/microfrontends) para refrescar el estado del manifiesto y Kill Switch
   */
  async loadManifest(): Promise<void> {
    this.isLoading.set(true);
    try {
      // 1. Intentar leer documento maestro /config/microfrontends
      const configDocRef = doc(this.firestore, 'config', 'microfrontends');
      const docSnap = await getDoc(configDocRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data && Array.isArray(data['modules'])) {
          this.configs.set(data['modules'] as MicrofrontendConfig[]);
          this.isLoading.set(false);
          return;
        }
      }

      // 2. Intentar leer colección /microfrontends
      const colRef = collection(this.firestore, 'microfrontends');
      const colSnap = await getDocs(colRef);
      if (!colSnap.empty) {
        const fetchedConfigs: MicrofrontendConfig[] = [];
        colSnap.forEach((d) => {
          fetchedConfigs.push({ id: d.id, ...d.data() } as MicrofrontendConfig);
        });
        if (fetchedConfigs.length > 0) {
          this.configs.set(fetchedConfigs);
          this.isLoading.set(false);
          return;
        }
      }
    } catch (err) {
      console.warn('No se pudo cargar el manifiesto desde Firestore, usando configuración local base:', err);
    } finally {
      this.isLoading.set(false);
    }
  }

  getConfigByRoute(routePath: string): MicrofrontendConfig | undefined {
    return this.configs().find((c) => c.routePath === routePath || c.id === routePath);
  }

  isModuleActive(routePath: string): boolean {
    const config = this.getConfigByRoute(routePath);
    return config ? config.active : false;
  }

  isUserAllowed(routePath: string, userRole: string | null): boolean {
    const config = this.getConfigByRoute(routePath);
    if (!config) return false;
    if (userRole === 'SUPER_ADMIN') return true;
    if (!config.rolesAllowed || config.rolesAllowed.length === 0) return true;
    return !!(userRole && config.rolesAllowed.includes(userRole));
  }
}
