import {
  HttpInterceptorFn,
  HttpContextToken,
  HttpContext,
  HttpErrorResponse
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { TokenService } from '../services/token.service';
import { AuthService } from '../services/auth.service';

/**
 * Mark a request so the interceptor skips token injection and 401 handling.
 * Use this for the /auth/* endpoints (sign-in, refresh, etc.) to avoid
 * circular refresh loops.
 */
export const SKIP_AUTH = new HttpContextToken<boolean>(() => false);

export function skipAuthContext(): HttpContext {
  return new HttpContext().set(SKIP_AUTH, true);
}

/**
 * authInterceptor
 *
 * Security contract:
 *  1. Every outgoing request gets `withCredentials: true` so the browser
 *     attaches the HttpOnly refresh-token cookie automatically.
 *  2. The access token is read exclusively from in-memory TokenService —
 *     never from localStorage — protecting against XSS token theft.
 *  3. On a 401 response the interceptor:
 *       a. Calls POST /auth/refresh (cookie is sent automatically).
 *       b. Stores the new access token in memory.
 *       c. Retries the original request with the new token.
 *       d. Queues any concurrent 401s so only ONE refresh call is made.
 *       e. Signs the user out and redirects to /auth/signin on failure.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // All injections must happen at the top — we are in the injection context here.
  const tokenService = inject(TokenService);
  const authService  = inject(AuthService);
  const router       = inject(Router);

  // ── 1. Always send cookies (needed for the HttpOnly refresh-token cookie) ──
  let authReq = req.clone({ withCredentials: true });

  // ── 2. Attach the in-memory access token (skip for auth endpoints) ────────
  if (!req.context.get(SKIP_AUTH)) {
    const token = tokenService.getAccessToken();
    if (token) {
      authReq = authReq.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });
    }
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // ── 3. Handle 401 — attempt token refresh, then retry ─────────────────
      const is401          = error.status === 401;
      const isAuthEndpoint = req.context.get(SKIP_AUTH) || req.url.includes('/auth/');

      if (!is401 || isAuthEndpoint) {
        return throwError(() => error);
      }

      // ── 3a. Another refresh is already in progress → wait and retry ───────
      if (tokenService.isRefreshing) {
        return tokenService.waitForRefresh$().pipe(
          switchMap(newToken => {
            if (!newToken) {
              return throwError(() => error);
            }
            return next(req.clone({
              withCredentials: true,
              setHeaders: { Authorization: `Bearer ${newToken}` }
            }));
          })
        );
      }

      // ── 3b. Start the refresh cycle ────────────────────────────────────────
      tokenService.startRefresh();

      return authService.refreshAccessToken().pipe(
        switchMap(newToken => {
          tokenService.completeRefresh(newToken);
          if (!newToken) {
            authService.signOut();
            router.navigate(['/auth/signin']);
            return throwError(() => error);
          }
          
          // Retry the original request with the new token
          return next(req.clone({
            withCredentials: true,
            setHeaders: { Authorization: `Bearer ${newToken}` }
          }));
        }),
        catchError(refreshError => {
          tokenService.completeRefresh(null);
          const isAuthError = refreshError instanceof HttpErrorResponse &&
            (refreshError.status === 401 || refreshError.status === 403);
          if (isAuthError) {
            authService.signOut();
            router.navigate(['/auth/signin']);
          }
          return throwError(() => refreshError);
        })
      );
    })
  );
};
