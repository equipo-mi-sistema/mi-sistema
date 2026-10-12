export interface MicrofrontendConfig {
  id: string;
  name: string;
  routePath: string;
  remoteEntry: string;
  exposedModule: string;
  active: boolean;
  rolesAllowed: string[];
  icon?: string;
  order: number;
  badge?: string;
  description?: string;
}
