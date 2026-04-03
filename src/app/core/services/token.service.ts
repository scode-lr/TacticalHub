import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, take } from 'rxjs/operators';

/**
 * TokenService
 *
 * Holds the access token exclusively in memory (Angular signal).
 * It is NEVER written to localStorage or sessionStorage, making it immune
 * to XSS token-theft attacks.
 *
 * The refresh token lives in an HttpOnly cookie managed by the server.
 * JavaScript never reads or writes it; the browser attaches it automatically
 * on requests that include `withCredentials: true`.
 *
 * Concurrent 401-refresh handling:
 *   When multiple requests arrive with a 401 simultaneously, only one refresh
 *   call is made. The others wait on `waitForRefresh$()` and are retried when
 *   the new access token is emitted.
 */
@Injectable({
  providedIn: 'root'
})
export class TokenService {

  // ─── In-memory access token ──────────────────────────────────────────────

  private readonly _accessToken = signal<string | null>(null);
  /** Read-only Signal; subscribe to react to token changes in templates. */
  readonly accessToken = this._accessToken.asReadonly();

  setAccessToken(token: string): void {
    this._accessToken.set(token);
  }

  getAccessToken(): string | null {
    return this._accessToken();
  }

  clearAccessToken(): void {
    this._accessToken.set(null);
  }

  // ─── Concurrent refresh coordination ─────────────────────────────────────

  private _isRefreshing = false;
  private readonly _refreshSubject = new BehaviorSubject<string | null>(null);

  get isRefreshing(): boolean {
    return this._isRefreshing;
  }

  /** Mark that a refresh call has started; resets the subject to null to
   *  make subsequent callers wait properly. */
  startRefresh(): void {
    this._isRefreshing = true;
    this._refreshSubject.next(null);
  }

  /** Notify all waiting requests that refresh has completed.
   *  Pass the new token on success, or null on failure. */
  completeRefresh(newToken: string | null): void {
    this._isRefreshing = false;
    this._refreshSubject.next(newToken);
  }

  /** Observable that emits once when a pending refresh resolves. */
  waitForRefresh$(): Observable<string | null> {
    return this._refreshSubject.pipe(
      filter(token => token !== null),
      take(1)
    );
  }

  // ─── JWT helpers ──────────────────────────────────────────────────────────

  /**
   * Returns true if the access token is absent or will expire within
   * 30 seconds (clock-skew buffer).
   */
  isAccessTokenExpired(): boolean {
    const token = this._accessToken();
    if (!token) return true;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return Date.now() >= (payload.exp * 1000) - 30_000;
    } catch {
      return true;
    }
  }

  /** Returns the token expiry as a Date, or null if unavailable. */
  getTokenExpiry(): Date | null {
    const token = this._accessToken();
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return new Date(payload.exp * 1000);
    } catch {
      return null;
    }
  }
}
