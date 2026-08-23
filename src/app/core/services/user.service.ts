import { Injectable, signal, inject } from '@angular/core';
import { firstValueFrom, map } from 'rxjs';
import { User, AuthUser } from '../models';
import { Role, RoleType } from '../models/role.model';
import { STORAGE_KEYS } from '../constants/storage-keys';
import { StorageService } from './storage.service';
import { NavigationService } from './navigation.service';
import { AuthService } from './auth.service';
import { ApiResponse, ApiService } from './api.service';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly storageService = inject(StorageService);
  private readonly navigationService = inject(NavigationService);
  private readonly authService = inject(AuthService);
  private readonly apiService = inject(ApiService);
  private readonly tokenService = inject(TokenService);

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
        return authUser;
      }

      return null;
    } catch (error) {
      return null;
    }
  }
  
  async logout() {
    await this.authService.signOut();
  }
}
