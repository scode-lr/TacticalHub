import { RoleType } from '@core/models/role.model';

const ROLE_LABELS: Record<RoleType, string> = {
  [RoleType.Admin]: 'Admin',
  [RoleType.Coach]: 'Coach',
  [RoleType.Viewer]: 'Viewer',
  [RoleType.Guest]: 'Guest'
};

export class RoleUtils {
  static getLabel(roleId: RoleType): string {
    return ROLE_LABELS[roleId];
  }

  static getId(label: string): RoleType | undefined {
    const entry = Object.entries(ROLE_LABELS).find(([, value]) => value === label);
    return entry ? (Number(entry[0]) as RoleType) : undefined;
  }

  static isAdmin(roleId: RoleType): boolean {
    return roleId === RoleType.Admin;
  }

  static isCoach(roleId: RoleType): boolean {
    return roleId === RoleType.Coach;
  }

  static isViewer(roleId: RoleType): boolean {
    return roleId === RoleType.Viewer;
  }

  static isGuest(roleId: RoleType): boolean {
    return roleId === RoleType.Guest;
  }
}


