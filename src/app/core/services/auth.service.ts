import { Injectable, signal, inject } from '@angular/core';
import { Observable, firstValueFrom, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { User } from '../models';
import { SignInRequest, SignUpRequest, ChangePasswordRequest, ForgotPasswordRequest, ResetPasswordRequest } from '../requests/auth.request';
import { AuthResponse } from '../responses/auth.response';
import { STORAGE_KEYS } from '../constants/storage-keys';
import { TranslationService } from './i18n/translation.service';
import { StorageService } from './storage.service';
import { ApiService } from './api.service';
import { TokenService } from './token.service';
import { NavigationService } from './navigation.service';

export interface IAuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
}

export interface IAuthResponse {
  success: boolean;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly translationService = inject(TranslationService);
  private readonly storageService = inject(StorageService);
  private readonly navigationService = inject(NavigationService);
  private readonly apiService = inject(ApiService);
  private readonly tokenService = inject(TokenService);
  private readonly _isLoading = signal<boolean>(false);
  readonly isLoading = this._isLoading.asReadonly();

  _currentUser = signal<User | null>(null);

  // ─── App initialization ──────────────────────────────────────────────────

  /**
   * Called via APP_INITIALIZER before the app renders.
   * If a user profile is cached in localStorage, we attempt a silent token
   * refresh using the HttpOnly refresh-token cookie.  On success the new
   * access token is stored in memory; on failure the stale user cache is
   * cleared so the guard redirects to sign-in.
   */
  initializeAuth(): Promise<boolean> {
    const storedUser = this.storageService.get<User>(STORAGE_KEYS.USER);
    if (!storedUser) {
      // No cached session — nothing to restore.
      return Promise.resolve(false);
    }

    // Pre-populate the user signal so UI has data immediately.
    this._currentUser.set(storedUser);

    return firstValueFrom(
      this.refreshAccessToken().pipe(
        map(token => {
          if (token) {
            return true;
          }
          // Refresh cookie is gone / expired — clear the stale cache.
          this.cleanSesion();
          return false;
        }),
        catchError(() => {
          this.cleanSesion();
          this.navigationService.navigateTo(['auth/signin']);
          return of(false);
        })
      )
    );
  }

  // ─── Token refresh ───────────────────────────────────────────────────────

  /**
   * Exchanges the HttpOnly refresh-token cookie for a new short-lived access
   * token.  Uses `skipAuth: true` and `withCredentials: true` directly so
   * this call bypasses the auth interceptor (avoiding circular 401 loops).
   * Returns the new access token string, or null on failure.
   */
  refreshAccessToken(): Observable<string | null> {
    return this.apiService.post<AuthResponse>(
      '/auth/refresh',
      {},
      { skipAuth: true, withCredentials: true }
    ).pipe(
      map(response => {
        if (response.success && response.data?.token) {
          this.tokenService.setAccessToken(response.data.token);
          // Keep user in sync if the response carries updated data.
          if (response.data.user) {
            this._currentUser.set(response.data.user);
          }
          return response.data.token;
        }
        return null;
      }),
      catchError(() => of(null))
    );
  }

  async signIn(credentials: SignInRequest): Promise<IAuthResponse> {
    try {
      this._isLoading.set(true);
      
      if (!credentials.email || credentials.password.length < 6) {
        this._isLoading.set(false);
        return { 
          success: false, 
          message: this.translationService.instant('validation.checkInput') 
        };
      }

      const response = await firstValueFrom(
        this.apiService.post<AuthResponse>('/auth/signin', {
          email: credentials.email,
          password: credentials.password,
          rememberMe: credentials.rememberMe
        })
      );

      if (response.success && response.data) {
        const { user, token } = response.data;

        // Store user profile for UX persistence; access token stays in memory only.
        this.storageService.set<User>(STORAGE_KEYS.USER, user);
        this.tokenService.setAccessToken(token);

        this._currentUser.set(user);
        this._isLoading.set(false);

        return { 
          success: true, 
          message: response.message || this.translationService.instant('messages.signInSuccess')
        };
      } else {
        this._isLoading.set(false);
        return { 
          success: false, 
          message: response.message || this.translationService.instant('messages.signInError')
        };
      }
    } catch (error: any) {
      this._isLoading.set(false);
      return { 
        success: false, 
        message: error.message || this.translationService.instant('messages.signInError')
      };
    }
  }

  async signUp(userData: SignUpRequest): Promise<IAuthResponse> {
    try {
      this._isLoading.set(true);

      if (!userData.email || userData.password.length < 6) {
        this._isLoading.set(false);
        return {
          success: false,
          message: this.translationService.instant('validation.fillAllFields')
        };
      }

      const response = await firstValueFrom(
        this.apiService.post<AuthResponse>('/auth/signup', {
          email: userData.email,
          password: userData.password,
          firstName: userData.firstName,
          lastName: userData.lastName,
          birthDate: userData.birthDate,
          username: userData.username
        })
      );

      if (response.success && response.data) {
        const { user, token } = response.data;
        // Persist user profile so initializeAuth can restore the session on reload.
        this.storageService.set<User>(STORAGE_KEYS.USER, user);
        this.tokenService.setAccessToken(token);
        this._currentUser.set(user);
        this._isLoading.set(false);
        return {
          success: true,
          message: response.message || this.translationService.instant('messages.signUpSuccess')
        };
      }

      this._isLoading.set(false);
      return {
        success: false,
        message: response.message || this.translationService.instant('messages.signUpError')
      };
    } catch (error: any) {
      this._isLoading.set(false);
      return {
        success: false,
        message: error.message || this.translationService.instant('messages.signUpError')
      };
    }
  }

  async signInWithGoogle(): Promise<IAuthResponse> {
    return {
      success: false,
      message: 'Google Sign-In not implemented yet'
    };
  }

  async signInWithApple(): Promise<IAuthResponse> {
    return {
      success: false,
      message: 'Apple Sign-In not implemented yet'
    };
  }

  async signInAsGuest(): Promise<IAuthResponse> {
    try {
      this._isLoading.set(true);

      const response = await firstValueFrom(
        this.apiService.post<AuthResponse>('/auth/guest', {})
      );

      if (response.success && response.data) {
        const { user, token } = response.data;
        this.storageService.set<User>(STORAGE_KEYS.USER, user);
        this.tokenService.setAccessToken(token);
        this._currentUser.set(user);
        this._isLoading.set(false);
        return {
          success: true,
          message: response.message || this.translationService.instant('messages.guestLoginSuccess')
        };
      }

      this._isLoading.set(false);
      return {
        success: false,
        message: response.message || this.translationService.instant('messages.guestLoginError')
      };
    } catch (error: any) {
      this._isLoading.set(false);
      return {
        success: false,
        message: error.message || this.translationService.instant('messages.guestLoginError')
      };
    }
  }

  async signOut(): Promise<void> {
    try {
      // Notify the backend so it can expire the HttpOnly refresh-token cookie.
      await firstValueFrom(
        this.apiService.post('/auth/logout', {}, { skipAuth: true, withCredentials: true })
      );
    } catch {
      // Perform local logout even if the backend call fails.
    } finally {
      this.cleanSesion();
      this.navigationService.navigateTo(['auth/signin']);
    }
  }

  async updatePassword(data: ChangePasswordRequest): Promise<IAuthResponse> {
    try {
      this._isLoading.set(true);
      const response = await firstValueFrom(
        this.apiService.put<{ success: boolean; message?: string }>('/auth/password', {
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        })
      );
      this._isLoading.set(false);
      return {
        success: response.success,
        message: response.message ?? this.translationService.instant(
          response.success ? 'messages.passwordUpdated' : 'messages.passwordUpdateError'
        ),
      };
    } catch (error: any) {
      this._isLoading.set(false);
      return { success: false, message: error.message ?? this.translationService.instant('messages.passwordUpdateError') };
    }
  }

  async forgotPassword(data: ForgotPasswordRequest): Promise<IAuthResponse> {
    try {
      this._isLoading.set(true);
      const response = await firstValueFrom(
        this.apiService.post<{ success: boolean; message?: string }>('/auth/forgot-password', { email: data.email })
      );
      this._isLoading.set(false);
      return {
        success: response.success,
        message: response.message ?? this.translationService.instant('messages.forgotPasswordSent'),
      };
    } catch (error: any) {
      this._isLoading.set(false);
      return { success: false, message: error.message ?? this.translationService.instant('messages.forgotPasswordSent') };
    }
  }

  async resetPassword(data: ResetPasswordRequest): Promise<IAuthResponse> {
    try {
      this._isLoading.set(true);
      const response = await firstValueFrom(
        this.apiService.post<{ success: boolean; message?: string }>('/auth/reset-password', {
          token: data.token,
          newPassword: data.newPassword,
        })
      );
      this._isLoading.set(false);
      return {
        success: response.success,
        message: response.message ?? this.translationService.instant(
          response.success ? 'messages.passwordResetSuccess' : 'messages.invalidResetLink'
        ),
      };
    } catch (error: any) {
      this._isLoading.set(false);
      return { success: false, message: error.message ?? this.translationService.instant('messages.invalidResetLink') };
    }
  }

  /** Clears all client-side auth state.  The access token is memory-only so
   *  it is simply discarded.  The refresh-token cookie is expired by the
   *  server during signOut(); there is nothing to remove from localStorage. */
  private cleanSesion(): void {
    this.storageService.remove(STORAGE_KEYS.USER);
    this.storageService.remove(STORAGE_KEYS.SELECTED_ROLE);
    this.storageService.remove(STORAGE_KEYS.CLUB_INFO);
    this.tokenService.clearAccessToken();
    this._currentUser.set(null);
  }
}
