import { Injectable, signal, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { User, AuthUser } from '../models';
import { Role, RoleType } from '../models/role.model';
import { STORAGE_KEYS } from '../constants/storage-keys';
import { StorageService } from './storage.service';
import { NavigationService } from './navigation.service';
import { AuthService } from './auth.service';
import { ApiService } from './api.service';
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
   * Returns the in-memory access token.
   * Do NOT use for storage reads — the token is never persisted to
   * localStorage. Use TokenService directly when possible.
   */
  getStoredToken(): string | null {
    return this.tokenService.getAccessToken();
  }

  setUser(user: User): void {
    this.authService._currentUser.set(user);
    this.storageService.set<User>(STORAGE_KEYS.USER, user);
  }

  isAuthenticated(): boolean {
    // Access token lives in memory only; its presence proves the session is
    // still valid (it was issued or refreshed on this app load).
    const hasToken = !!this.tokenService.getAccessToken();
    const user     = this.getStoredUser();
    return hasToken && !!user;
  }

  getCurrentRole(): Role | null {
    const { roleType, roleId } = this.navigationService.extractRoleDetails();
    const user = this.getStoredUser();
    console.log('UserService: Getting current role for roleType=', roleType, 'roleId=', roleId, 'user=', user);
    
    if (user && roleId) {
      const role = user.roles?.find(r => r.roleId === roleType && r.id === roleId);
      console.log('UserService: Found current role:', role);
      return role || null;
    }
    
    return null;
  }

  async fetchUserProfile(): Promise<User | null> {
    try {
      const authUser = await firstValueFrom(this.apiService.get<User>(`/users/me`));

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
