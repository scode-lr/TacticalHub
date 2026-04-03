import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '@core/services/token.service';
import { UserService } from '@core/services/user.service';

export const authGuard: CanActivateFn = (route, state) => {
  const tokenService = inject(TokenService);
  const userService  = inject(UserService);
  const router       = inject(Router);

  // Authentication is proven by the presence of the in-memory access token
  // (populated during APP_INITIALIZER via the HttpOnly cookie refresh flow).
  const isAuthenticated = !!tokenService.getAccessToken() && !!userService.getStoredUser();
  const requiresAuth    = route.data?.['requiresAuth'] !== false;

  if (requiresAuth) {
    if (isAuthenticated) {
      return true;
    }
    router.navigate(['/auth/signin'], {
      queryParams: { returnUrl: state.url }
    });
    return false;
  } else {
    if (!isAuthenticated) {
      return true;
    }
    router.navigate(['/teams/selection']);
    return false;
  }
};
