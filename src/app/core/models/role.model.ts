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
  clubName?: string;
  clubId: number;
  clubLogo?: string;
  roleId: RoleType;
  description?: string;
  teamName?: string;
  createdAt?: Date;
  status?: RoleStatus;
  userId?: number;
}
