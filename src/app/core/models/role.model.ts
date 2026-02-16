import { Club } from "./club.model";

export enum RoleStatus {
  Active = 'AC',
  Pending = 'P',
  Draft = 'D'
}

export enum RoleType {
  Admin = 1,
  Coach = 2,
  Viewer = 3,
  Guest = 4
}

export interface Role {
  id: number;
  name: string;
  type: RoleType;
  club: Club;
  description?: string;
  permissions?: string[];
  team?: string;
  createdAt: Date;
  status?: RoleStatus;
}
