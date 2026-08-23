import { Injectable, OnDestroy, inject, signal } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { STORAGE_KEYS } from '../constants/storage-keys';
import { StorageService } from './storage.service';

/** Sentinel meaning "a refresh is in flight; no result yet". Kept distinct
 *  from null (which means "refresh failed") so waiters resolve in both cases. */
const PENDING = Symbol('refresh-pending');

/**
 * TokenService
 *
 * Keeps the access token in an Angular signal and persists it in localStorage
 * so a session survives reloads, new tabs, browser restarts and native app
 * restarts. The persisted value is restored only while the JWT is valid.
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
export class TokenService implements OnDestroy {

  private readonly storageService = inject(StorageService);

  // ─── Reactive access token with persistent backing ──────────────────────

  private readonly _accessToken = signal<string | null>(null);
  /** Read-only Signal; subscribe to react to token changes in templates. */
  readonly accessToken = this._accessToken.asReadonly();

  private readonly storageListener = (event: StorageEvent): void => {
    if (event.key !== STORAGE_KEYS.TOKEN) return;

    const token = this.readTokenFromStorage();
    if (token && !this.isTokenExpired(token)) {
      this._accessToken.set(token);
      return;
    }

    this._accessToken.set(null);
    if (token) this.storageService.remove(STORAGE_KEYS.TOKEN);
  };

  constructor() {
    const storedToken = this.readTokenFromStorage();
    if (storedToken && !this.isTokenExpired(storedToken)) {
      this._accessToken.set(storedToken);
    } else if (storedToken) {
      this.storageService.remove(STORAGE_KEYS.TOKEN);
    }

    window.addEventListener('storage', this.storageListener);
  }

  ngOnDestroy(): void {
    window.removeEventListener('storage', this.storageListener);
  }

  setAccessToken(token: string): void {
    this._accessToken.set(token);
    this.storageService.set<string>(STORAGE_KEYS.TOKEN, token);
  }

  getAccessToken(): string | null {
    return this._accessToken();
  }

  clearAccessToken(): void {
    this._accessToken.set(null);
    this.storageService.remove(STORAGE_KEYS.TOKEN);
  }

  // ─── Concurrent refresh coordination ─────────────────────────────────────

  private _isRefreshing = false;
  // The subject distinguishes three states: PENDING (refresh in flight),
  // a token string (success) and null (failure). Using a dedicated PENDING
  // sentinel — rather than reusing null for "in flight" — guarantees that
  // waiting requests are notified on FAILURE too (null), instead of hanging
  // forever waiting for a value that never comes.
  private readonly _refreshSubject =
    new BehaviorSubject<string | null | typeof PENDING>(PENDING);

  get isRefreshing(): boolean {
    return this._isRefreshing;
  }

  /** Mark that a refresh call has started; resets the subject to PENDING so
   *  subsequent callers wait until it resolves. */
  startRefresh(): void {
    this._isRefreshing = true;
    this._refreshSubject.next(PENDING);
  }

  /** Notify all waiting requests that refresh has completed.
   *  Pass the new token on success, or null on failure. */
  completeRefresh(newToken: string | null): void {
    this._isRefreshing = false;
    this._refreshSubject.next(newToken);
  }

  /** Observable that emits once when a pending refresh resolves — the new
   *  token on success, or null on failure. Never emits the PENDING sentinel. */
  waitForRefresh$(): Observable<string | null> {
    return this._refreshSubject.pipe(
      filter((value): value is string | null => value !== PENDING),
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
    return !token || this.isTokenExpired(token);
  }

  private readTokenFromStorage(): string | null {
    return this.storageService.get<string>(STORAGE_KEYS.TOKEN);
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payloadSegment = token.split('.')[1]
        .replace(/-/g, '+')
        .replace(/_/g, '/');
      const paddedPayload = payloadSegment.padEnd(
        payloadSegment.length + (4 - payloadSegment.length % 4) % 4,
        '='
      );
      const payload = JSON.parse(atob(paddedPayload));
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
      const payloadSegment = token.split('.')[1]
        .replace(/-/g, '+')
        .replace(/_/g, '/');
      const paddedPayload = payloadSegment.padEnd(
        payloadSegment.length + (4 - payloadSegment.length % 4) % 4,
        '='
      );
      const payload = JSON.parse(atob(paddedPayload));
      return new Date(payload.exp * 1000);
    } catch {
      return null;
    }
  }
}
