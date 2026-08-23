import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { authGuard } from './auth.guard';
import { NetworkService } from '@core/services/network.service';
import { TokenService } from '@core/services/token.service';
import { UserService } from '@core/services/user.service';
import { AuthService } from '@core/services/auth.service';

describe('authGuard', () => {
  const router = jasmine.createSpyObj<Router>('Router', ['createUrlTree', 'navigate']);
  const networkService = jasmine.createSpyObj<NetworkService>('NetworkService', ['isOnline']);
  const tokenService = jasmine.createSpyObj<TokenService>('TokenService', [
    'getAccessToken',
    'isAccessTokenExpired'
  ]);
  const userService = jasmine.createSpyObj<UserService>('UserService', ['getStoredUser']);
  const authService = {
    sessionRecoveryPending: jasmine.createSpy('sessionRecoveryPending')
  };
  const offlineTree = {} as UrlTree;

  beforeEach(() => {
    router.createUrlTree.calls.reset();
    router.navigate.calls.reset();
    router.createUrlTree.and.returnValue(offlineTree);
    tokenService.isAccessTokenExpired.and.returnValue(true);
    authService.sessionRecoveryPending.and.returnValue(false);

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: router },
        { provide: NetworkService, useValue: networkService },
        { provide: TokenService, useValue: tokenService },
        { provide: UserService, useValue: userService },
        { provide: AuthService, useValue: authService }
      ]
    });
  });

  it('redirects a cached session to the offline page when the device is offline', () => {
    networkService.isOnline.and.returnValue(false);
    tokenService.getAccessToken.and.returnValue(null);
    userService.getStoredUser.and.returnValue({ id: 1 } as never);

    const result = TestBed.runInInjectionContext(() => authGuard(
      { data: { requiresAuth: true } } as unknown as ActivatedRouteSnapshot,
      { url: '/teams/selection' } as RouterStateSnapshot
    ));

    expect(result).toBe(offlineTree);
    expect(router.createUrlTree).toHaveBeenCalledWith(['/offline'], {
      queryParams: { returnUrl: '/teams/selection' }
    });
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('keeps a cached session recoverable when token refresh could not complete', () => {
    networkService.isOnline.and.returnValue(true);
    tokenService.getAccessToken.and.returnValue(null);
    userService.getStoredUser.and.returnValue({ id: 1 } as never);
    authService.sessionRecoveryPending.and.returnValue(true);

    const result = TestBed.runInInjectionContext(() => authGuard(
      { data: { requiresAuth: true } } as unknown as ActivatedRouteSnapshot,
      { url: '/app/3/12/home' } as RouterStateSnapshot
    ));

    expect(result).toBe(offlineTree);
    expect(router.createUrlTree).toHaveBeenCalledWith(['/offline'], {
      queryParams: { returnUrl: '/app/3/12/home' }
    });
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('does not trust an arbitrary stale cached user while online', () => {
    networkService.isOnline.and.returnValue(true);
    tokenService.getAccessToken.and.returnValue(null);
    userService.getStoredUser.and.returnValue({ id: 1 } as never);

    const result = TestBed.runInInjectionContext(() => authGuard(
      { data: { requiresAuth: true } } as unknown as ActivatedRouteSnapshot,
      { url: '/app/3/12/home' } as RouterStateSnapshot
    ));

    expect(result).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/auth/signin'], {
      queryParams: { returnUrl: '/app/3/12/home' }
    });
  });

  it('allows public routes offline when there is no cached session', () => {
    networkService.isOnline.and.returnValue(false);
    tokenService.getAccessToken.and.returnValue(null);
    userService.getStoredUser.and.returnValue(null);

    const result = TestBed.runInInjectionContext(() => authGuard(
      { data: { requiresAuth: false } } as unknown as ActivatedRouteSnapshot,
      { url: '/auth/welcome' } as RouterStateSnapshot
    ));

    expect(result).toBeTrue();
    expect(router.createUrlTree).not.toHaveBeenCalled();
  });

  it('keeps a valid restored session active during a network outage', () => {
    networkService.isOnline.and.returnValue(false);
    tokenService.getAccessToken.and.returnValue('valid-token');
    tokenService.isAccessTokenExpired.and.returnValue(false);
    userService.getStoredUser.and.returnValue({ id: 1 } as never);

    const result = TestBed.runInInjectionContext(() => authGuard(
      { data: { requiresAuth: true } } as unknown as ActivatedRouteSnapshot,
      { url: '/app/3/12/home' } as RouterStateSnapshot
    ));

    expect(result).toBeTrue();
    expect(router.createUrlTree).not.toHaveBeenCalled();
  });
});
