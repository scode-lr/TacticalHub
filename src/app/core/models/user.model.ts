import { Role } from "./role.model";

export interface AuthUser {
  id: number;
  email: string;
  username?: string;
  createdAt?: Date;
  isGuest?: boolean;
}

export interface UserMetadata {
  firstName?: string;
  lastName?: string;
  birthDate?: Date;
  avatar?: string | null;
  lastLogin?: Date;
}

export interface User extends AuthUser {
  roles?: Role[];
  status?: string;
  metadata?: UserMetadata;
  prefixPhoneNumber?: string;
  phoneNumber?: string;
}