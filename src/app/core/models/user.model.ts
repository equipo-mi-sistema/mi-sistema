export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'LEADER' | 'OPERATOR' | 'TEAM_OWNER' | 'MEMBER' | string | null;
export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';

export interface FirestoreUserDoc {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role?: UserRole;
  role_id?: string | null;
  team_id: string | null;
  cargo?: string;
  status: UserStatus;
  updatedAt?: string;
  [key: string]: unknown;
}

export interface CustomUserClaims {
  role_id?: string;
  team_id?: string;
  roles?: string[];
  modules?: string[];
  scope?: string;
  admin?: boolean;
  city?: string;
  comuna?: number;
  [key: string]: unknown;
}

export interface AppUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: UserRole;
  role_id: string | null;
  roleId: string | null;
  teamId: string | null;
  team_id: string | null;
  cargo?: string;
  status: UserStatus;
  claims: CustomUserClaims;
}
