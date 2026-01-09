import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { StorageService } from '@core/services/storage.service';
import { STORAGE_KEYS } from '@core/constants/storage-keys';
import { Role } from '@core/models/role.model';
import { NavigationService } from '@services/navigation.service';

export const roleAccessGuard: CanActivateFn = (route, state) => {
  const storageService = inject(StorageService);
  const navigationService = inject(NavigationService);

  const roleType = route.data['roleType'];
  const roleId = route.paramMap.get('roleId');
  if (!roleType && roleType !== 0) {
    navigationService.navigateTo(['/teams/selection']);
    return false;
  }

  const selectedRole = storageService.get<Role>(STORAGE_KEYS.SELECTED_ROLE);

  if (!selectedRole) {
    navigationService.navigateTo(['/teams/selection']);
    return false;
  }

  if (selectedRole.type !== roleType) {
    navigationService.navigateTo(['/teams/selection']);
    return false;
  }

  if (roleId && selectedRole.id !== Number(roleId)) {
    navigationService.navigateTo(['/teams/selection']);
    return false;
  }

  return true;
};
