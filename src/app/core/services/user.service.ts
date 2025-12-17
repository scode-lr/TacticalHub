import { Injectable, signal, inject } from '@angular/core';
import { User, AuthUser } from '../models';
import { mockUsers } from '../../../mocks/user.mock';
import { STORAGE_KEYS } from '../constants/storage-keys';
import { StorageService } from './storage.service';
import { NavigationService } from './navigation.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly storageService = inject(StorageService);
  private readonly navigationService = inject(NavigationService);
  private readonly authService = inject(AuthService);

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

  getStoredToken(): string | null {
    return this.storageService.getString(STORAGE_KEYS.TOKEN);
  }

  setUser(user: User): void {
    this.authService._currentUser.set(user);
    this.storageService.set<User>(STORAGE_KEYS.USER, user);
  }

  isAuthenticated(): boolean {
    const token = this.getStoredToken();
    const user = this.getStoredUser();
    return !!(token && user);
  }

  async fetchUserProfile(userId: number): Promise<User | null> {   
    const authUser: User | null = mockUsers.find(user => user.id === userId) ?? null;
    
    if (authUser) {
      this.authService._currentUser.set(authUser);
      this.setUser(authUser);
      return authUser;
    }
    
    return null;
  }
  
  logout() {
    this.authService.signOut();
    this.navigationService.navigateTo(['signin']);
  }
}
