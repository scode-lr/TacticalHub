import {
  HttpInterceptorFn,
  HttpContextToken,
  HttpContext,
  HttpErrorResponse
} from '@angular/common/http';
import { inject } from '@angular/core';
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
 *       e. Ends the session locally ONLY on a real 401/403 from the refresh
 *          endpoint. Transient errors (timeout, status 0, 5xx) propagate
 *          without logging the user out, so a network blip never kills the
 *          session.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // All injections must happen at the top — we are in the injection context here.
  const tokenService = inject(TokenService);
  const authService  = inject(AuthService);

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
        // Handle a FAILED refresh first, isolated from any error the retried
        // request might raise later (the catchError sits upstream of switchMap).
        catchError((refreshError: unknown) => {
          tokenService.completeRefresh(null);
          if (authService.isAuthError(refreshError)) {
            // Real 401/403 → the refresh cookie is gone. End the session
            // locally (no /auth/logout call) and surface the original error.
            authService.clearSessionLocally();
            return throwError(() => error);
          }
          // Transient error (timeout, status 0, 5xx). DO NOT log out — keep the
          // session and just fail this request so the caller can retry.
          return throwError(() => refreshError);
        }),
        switchMap(newToken => {
          tokenService.completeRefresh(newToken);
          if (!newToken) {
            // Server responded without a token → treat as session ended.
            authService.clearSessionLocally();
            return throwError(() => error);
          }

          // Retry the original request with the new token.
          return next(req.clone({
            withCredentials: true,
            setHeaders: { Authorization: `Bearer ${newToken}` }
          }));
        })
      );
    })
  );
};
