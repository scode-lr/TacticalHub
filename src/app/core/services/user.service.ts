import { Injectable, signal, inject } from '@angular/core';
import { Observable, firstValueFrom, map } from 'rxjs';
import { User, AuthUser } from '../models';
import { AvatarResponse } from '../responses/user.response';
import { Role, RoleType } from '../models/role.model';
import { STORAGE_KEYS } from '../constants/storage-keys';
import { StorageService } from './storage.service';
import { NavigationService } from './navigation.service';
import { AuthService } from './auth.service';
import { ApiResponse, ApiService } from './api.service';
import { TokenService } from './token.service';
import { MemberAvatarService } from './member-avatar.service';

/** Fallback shown whenever the user has no profile photo. */
export const DEFAULT_AVATAR = 'assets/default-avatar.svg';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly storageService = inject(StorageService);
  private readonly navigationService = inject(NavigationService);
  private readonly authService = inject(AuthService);
  private readonly apiService = inject(ApiService);
  private readonly tokenService = inject(TokenService);
  private readonly memberAvatarService = inject(MemberAvatarService);

  /**
   * Object URL of the current user's profile photo, or null when there is none.
   * The avatar endpoint is authenticated and private, so it cannot be bound
   * directly to `<img src>`: the blob is fetched once here and shared by every
   * component that renders the user's photo.
   */
  readonly avatarUrl = signal<string | null>(null);

  private avatarRequest: Promise<void> | null = null;

  constructor() {
    this.loadStoredUser();
  }

  private loadStoredUser(): void {
    const storedUser = this.storageService.get<User>(STORAGE_KEYS.USER);
    if (storedUser) {
      this.authService._currentUser.set(storedUser);
    }
  }

  getCurrentUser(): User | null {
    if(this.authService._currentUser()) {
        return this.authService._currentUser();
    }

    const storedUser = this.getStoredUser();
    if (storedUser) {
      this.authService._currentUser.set(storedUser);
      return storedUser;
    }
    return null;
  }

  getStoredUser(): User | null {
    return this.storageService.get<User>(STORAGE_KEYS.USER);
  }

  /**
   * Returns the current access token managed and restored by TokenService.
   */
  getStoredToken(): string | null {
    return this.tokenService.getAccessToken();
  }

  setUser(user: User): void {
    this.authService._currentUser.set(user);
    this.storageService.set<User>(STORAGE_KEYS.USER, user);
  }

  isAuthenticated(): boolean {
    const hasToken = !!this.tokenService.getAccessToken() &&
      !this.tokenService.isAccessTokenExpired();
    const user     = this.getStoredUser();
    return hasToken && !!user;
  }

  getCurrentRole(): Role | null {
    const { roleType, roleId } = this.navigationService.extractRoleDetails();
    const user = this.getStoredUser();

    if(user?.isGuest){
      return user.roles?.[0] || null;
    }

    if (user && roleId) {
      return user.roles?.find(r => r.roleId === roleType && r.id === roleId) || null;
    }
    
    return null;
  }

  async fetchUserProfile(): Promise<User | null> {
    try {
      const authUser = await firstValueFrom(this.apiService.get<ApiResponse<User>>(`/users/me`).pipe(
        map(response => response.data)
      ));

      if (authUser) {
        this.setUser(authUser);
        // Keeps the shared avatar in sync when the flag changed server-side.
        void this.loadAvatar();
        return authUser;
      }

      return null;
    } catch (error) {
      return null;
    }
  }
  
  /**
   * Uploads a new profile photo, replacing any existing one.
   * @returns `true` when the server confirms the photo is stored.
   */
  async uploadAvatar(file: File): Promise<boolean> {
    const formData = new FormData();
    formData.append('photo', file);

    const response = await firstValueFrom(
      this.apiService.post<AvatarResponse>('users/me/avatar', formData, {
        isFormData: true,
        skipErrorHandler: true
      })
    );

    const hasAvatar = response?.hasAvatar ?? false;
    this.setHasAvatar(hasAvatar);
    // The uploaded file is already in memory: reuse it instead of downloading
    // the freshly stored image back from the API.
    this.setAvatarObjectUrl(hasAvatar ? URL.createObjectURL(file) : null);

    return hasAvatar;
  }

  /** Fetches the current user's profile photo as a blob (404 when there is none). */
  getAvatarBlob(): Observable<Blob> {
    return this.apiService.getBlob('users/me/avatar', { skipErrorHandler: true });
  }

  /** Deletes the current user's profile photo. */
  async deleteAvatar(): Promise<void> {
    await firstValueFrom(
      this.apiService.delete('users/me/avatar', { skipErrorHandler: true })
    );

    this.setHasAvatar(false);
    this.setAvatarObjectUrl(null);
  }

  /**
   * Loads the profile photo into `avatarUrl` when the user has one.
   * Safe to call from several components: concurrent calls share one request
   * and an already-loaded photo is not downloaded again unless `force` is set.
   */
  async loadAvatar(force = false): Promise<void> {
    const user = this.getCurrentUser();

    if (!user || user.isGuest || !user.hasAvatar) {
      this.setAvatarObjectUrl(null);
      return;
    }

    if (!force && this.avatarUrl()) return;
    if (this.avatarRequest) return this.avatarRequest;

    this.avatarRequest = (async () => {
      try {
        const blob = await firstValueFrom(this.getAvatarBlob());
        this.setAvatarObjectUrl(URL.createObjectURL(blob));
      } catch {
        // The photo is optional: fall back to the placeholder silently.
        this.setAvatarObjectUrl(null);
      } finally {
        this.avatarRequest = null;
      }
    })();

    return this.avatarRequest;
  }

  /** Replaces the shared object URL, revoking the previous one to avoid leaks. */
  private setAvatarObjectUrl(url: string | null): void {
    const previous = this.avatarUrl();
    if (previous === url) return;

    this.avatarUrl.set(url);

    if (previous?.startsWith('blob:')) {
      URL.revokeObjectURL(previous);
    }
  }

  private setHasAvatar(hasAvatar: boolean): void {
    const user = this.getCurrentUser();
    if (!user || user.hasAvatar === hasAvatar) return;

    this.setUser({ ...user, hasAvatar });
  }

  async logout() {
    this.setAvatarObjectUrl(null);
    // Other members' photos are cached as object URLs too: drop them so blobs
    // (and the club they belong to) never leak into the next session.
    this.memberAvatarService.clear();
    await this.authService.signOut();
  }
}
