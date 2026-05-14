import { AppStatus } from './app-status.model';

export enum RoleType {
  Admin = 1,
  Coach = 2,
  Member = 3,
  Guest = 4
}

export interface Role {
  id: number;
  clubName?: string;
  clubId: number;
  clubLogo?: string;
  roleId: RoleType;
  description?: string;
  teamName?: string;
  createdAt?: Date;
  status?: AppStatus;
  userId?: number;
}
