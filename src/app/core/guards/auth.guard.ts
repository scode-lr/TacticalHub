import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '@core/services/user.service';

export const authGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService);
  const router = inject(Router);

  const user = userService.getStoredUser();
  const requiresAuth = route.data?.['requiresAuth'] !== false;

  if (requiresAuth) {
    if (user) {
      return true;
    }
    router.navigate(['/auth/signin'], {
      queryParams: { returnUrl: state.url }
    });
    return false;
  } else {
    if (!user) {
      return true;
    }
    router.navigate(['/teams/selection']);
    return false;
  }
};
