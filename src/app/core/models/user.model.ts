import { Role } from "./role.model";

export interface AuthUser {
  id: number;
  email: string;
  username?: string;
  createdAt?: Date;
}

export interface User extends AuthUser {
  roles?: Role[];
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  prefixPhoneNumber?: string;
  phoneNumber?: string;
  dateOfBirth?: Date;
}