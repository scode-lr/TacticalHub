import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { StorageService } from '@core/services/storage.service';
import { NavigationService } from '@services/navigation.service';
import { ClubService } from '@services/club.service';
import { RolesService } from '@services/roles.service';

export const roleAccessGuard: CanActivateFn = (route, state) => {
  const navigationService = inject(NavigationService);
  const clubService = inject(ClubService);
  const roleService = inject(RolesService);

  const roleType = route.data['roleType'];
  const roleId = route.paramMap.get('roleId');
  const clubId = route.paramMap.get('clubId');

  if(clubId) {
    const selectedClubId = clubService.getInternalClubId();
    if (!selectedClubId || selectedClubId !== Number(clubId)) {
      navigationService.navigateTo(['/teams/selection']);
      return false;
    }
  }

  if (!roleType && roleType !== 0) {
    navigationService.navigateTo(['/teams/selection']);
    return false;
  }

  const selectedRole = roleService.getCurrentRole();

  if (!selectedRole) {
    navigationService.navigateTo(['/teams/selection']);
    return false;
  }

  if (selectedRole.roleId !== roleType) {
    navigationService.navigateTo(['/teams/selection']);
    return false;
  }

  if (roleId && selectedRole.id !== Number(roleId)) {
    navigationService.navigateTo(['/teams/selection']);
    return false;
  }

  return true;
};
