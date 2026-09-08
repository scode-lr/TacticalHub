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
  lastLogin?: Date;
}

export interface User extends AuthUser {
  roles?: Role[];
  status?: string;
  metadata?: UserMetadata;
  prefixPhoneNumber?: string;
  phoneNumber?: string;
  /**
   * Whether the user has a profile photo stored in the private bucket.
   * The photo itself is never a public URL: it must be fetched as a blob
   * from `GET /users/me/avatar` (see `UserService.getAvatarBlob`).
   */
  hasAvatar?: boolean;
}
