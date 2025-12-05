import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { StorageService } from '@core/services/storage.service';
import { STORAGE_KEYS } from '@core/constants/storage-keys';
import { Role } from '@core/models/role.model';

export const roleAccessGuard: CanActivateFn = (route, state) => {
  const storageService = inject(StorageService);
  const router = inject(Router);

  const roleIdParam = route.routeConfig?.data?.['roleId'];
  console.log('Role ID Param:',  roleIdParam);
  if (!roleIdParam) {
    router.navigate(['/teams/selection']);
    return false;
  }

  const roleIdNumber = parseInt(roleIdParam, 10);
  
  if (isNaN(roleIdNumber)) {
    router.navigate(['/teams/selection']);
    return false;
  }

  const selectedRole = storageService.get<Role>(STORAGE_KEYS.SELECTED_ROLE);

  if (!selectedRole) {
    router.navigate(['/teams/selection']);
    return false;
  }

  if (selectedRole.roleId !== roleIdNumber) {
    router.navigate(['/teams/selection']);
    return false;
  }

  return true;
};
