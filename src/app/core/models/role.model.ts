import { Club } from "./club.model";

export enum RoleStatus {
  Active = 'active',
  Pending = 'pending',
  Draft = 'draft'
}

export enum RoleType {
  Admin = 0,
  Coach = 1,
  Viewer = 2
}

export interface Role {
  id: string;
  name: string;
  roleId: RoleType;
  club: Club;
  description: string;
  permissions: string[];
  team?: string;
  createdAt: Date;
  status?: RoleStatus;
}
