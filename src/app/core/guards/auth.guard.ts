import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '@core/services/token.service';
import { UserService } from '@core/services/user.service';
import { NetworkService } from '@core/services/network.service';
import { AuthService } from '@core/services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const tokenService = inject(TokenService);
  const userService  = inject(UserService);
  const networkService = inject(NetworkService);
  const authService = inject(AuthService);
  const router       = inject(Router);

  // Authentication is proven by a present, non-expired access token together
  // with its cached user profile.
  const isOnline = networkService.isOnline();
  const accessToken = tokenService.getAccessToken();
  const storedUser = userService.getStoredUser();
  const hasUsableAccessToken = !!accessToken && !tokenService.isAccessTokenExpired();
  const isAuthenticated = hasUsableAccessToken && !!storedUser;
  const requiresAuth    = route.data?.['requiresAuth'] !== false;
  const hasRecoverableSession = !!storedUser &&
    (!isOnline || authService.sessionRecoveryPending());

  if (requiresAuth) {
    if (isAuthenticated) {
      return true;
    }
    if (hasRecoverableSession) {
      return router.createUrlTree(['/offline'], {
        queryParams: { returnUrl: state.url }
      });
    }
    router.navigate(['/auth/signin'], {
      queryParams: { returnUrl: state.url }
    });
    return false;
  } else {
    if (isAuthenticated) {
      router.navigate(['/teams/selection']);
      return false;
    }
    if (hasRecoverableSession) {
      return router.createUrlTree(['/offline'], {
        queryParams: { returnUrl: state.url }
      });
    }
    return true;
  }
};
