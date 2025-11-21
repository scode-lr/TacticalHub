import { Club } from "./club.model";

export enum RoleStatus {
  Active = 'active',
  Pending = 'pending',
  Draft = 'draft'
}

export interface Role {
  id: string;
  name: string;
  club: Club;
  description: string;
  permissions: string[];
  team?: string;
  createdAt: Date;
  status?: RoleStatus;
}
