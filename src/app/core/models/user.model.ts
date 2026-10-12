export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'LEADER' | 'OPERATOR' | null;
export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';

export interface FirestoreUserDoc {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: UserRole;
  team_id: string | null;
  status: UserStatus;
  updatedAt?: string;
  [key: string]: unknown;
}

export interface CustomUserClaims {
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
  teamId: string | null;
  status: UserStatus;
  claims: CustomUserClaims;
}
