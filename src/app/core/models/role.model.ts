import { Club } from "./club.model";

export class Role {
  id!: string;
  name!: string;
  club!: Club;
  description!: string;
  permissions!: string[];
  team?: string;
  createdAt!: Date;

  hasPermission(permission: string): boolean {
    return this.permissions.includes(permission);
  }

  hasAnyPermission(permissions: string[]): boolean {
    return permissions.some(permission => this.permissions.includes(permission));
  }

  hasAllPermissions(permissions: string[]): boolean {
    return permissions.every(permission => this.permissions.includes(permission));
  }
}
