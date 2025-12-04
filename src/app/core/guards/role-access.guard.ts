import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '@core/services/user.service';
import { RoleType } from '@core/models/role.model';

export const roleAccessGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService);
  const router = inject(Router);

  const roleIdParam = route.paramMap.get('roleId');
  
  if (!roleIdParam) {
    router.navigate(['/teams/selection']);
    return false;
  }

  const roleIdNumber = parseInt(roleIdParam, 10);
  
  if (isNaN(roleIdNumber)) {
    router.navigate(['/teams/selection']);
    return false;
  }

  const user = userService.getStoredUser();

  if (!user || !user.roles || user.roles.length === 0) {
    router.navigate(['/teams/selection']);
    return false;
  }

  const hasAccess = user.roles.some(role => role.roleId === roleIdNumber);

  if (!hasAccess) {
    router.navigate(['/teams/selection']);
    return false;
  }

  return true;
};
