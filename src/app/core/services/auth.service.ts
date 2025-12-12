import { Injectable, signal, computed, inject } from '@angular/core';
import { AuthUser, User } from '../models';
import { SignInRequest, SignUpRequest } from '../requests/auth.request';
import { mockUsers } from '../../../mocks/user.mock';
import { STORAGE_KEYS } from '../constants/storage-keys';
import { TranslationService } from './i18n/translation.service';
import { StorageService } from './storage.service';

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
  private readonly _token = signal<string | null>(null);
  private readonly _isLoading = signal<boolean>(false);
  readonly isLoading = this._isLoading.asReadonly();

  _currentUser = signal<User | null>(null);
  
  constructor() {
    this.checkStoredAuth();
  }

  private checkStoredAuth(): void {
    const storedUser = this.storageService.get<User>(STORAGE_KEYS.USER);
    const storedToken = this.storageService.getString(STORAGE_KEYS.TOKEN);
    
    if (storedUser && storedToken) {
      this._currentUser.set(storedUser);
      this._token.set(storedToken);
    }
  }

  async signIn(credentials: SignInRequest): Promise<IAuthResponse> {
    try {
      this._isLoading.set(true);
      await this.delay(1500);
      
      if (!credentials.email || credentials.password.length < 6) {
        this._isLoading.set(false);
        return { 
          success: false, 
          message: this.translationService.instant('validation.checkInput') 
        };
      }

      const authenticatedUser = mockUsers.find(user => user.email === credentials.email);
      
      if (!authenticatedUser) {
        this._isLoading.set(false);
        return { 
          success: false, 
          message: this.translationService.instant('messages.signInError') 
        };
      }

      const mockToken = this.generateToken();

      const authUser: AuthUser = {
        id: authenticatedUser.id,
        email: authenticatedUser.email,
        username: authenticatedUser.username,
        token: mockToken
      };
      
      this.storageService.set<AuthUser>(STORAGE_KEYS.USER, authUser);
      this.storageService.setString(STORAGE_KEYS.TOKEN, mockToken);
      
      this._currentUser.set(authUser);
      this._token.set(mockToken);
      this._isLoading.set(false);

      return { 
        success: true, 
        message: this.translationService.instant('messages.googleSignInSuccess') 
      };
    } catch (error) {
      this._isLoading.set(false);
      return { 
        success: false, 
        message: this.translationService.instant('messages.signInError') 
      };
    }
  }

  async signUp(userData: SignUpRequest): Promise<IAuthResponse> {
    try {
      this._isLoading.set(true);
      await this.delay(2000);
      
      if (userData.email && userData.password.length >= 6) {
        const newUser: User = {
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          id: this.generateId(),
          token: this.generateToken(),
        };

        const mockToken = this.generateToken();
        
        this.storageService.set<User>(STORAGE_KEYS.USER, newUser);
        this.storageService.setString(STORAGE_KEYS.TOKEN, mockToken);
        
        this._currentUser.set(newUser);
        this._token.set(mockToken);
        this._isLoading.set(false);

        return { 
          success: true, 
          message: this.translationService.instant('messages.accountCreatedSuccess') 
        };
      } else {
        this._isLoading.set(false);
        return { 
          success: false, 
          message: this.translationService.instant('validation.fillAllFields') 
        };
      }
    } catch (error) {
      this._isLoading.set(false);
      return { 
        success: false, 
        message: this.translationService.instant('messages.signUpError') 
      };
    }
  }

  async signInWithGoogle(): Promise<IAuthResponse> {
    try {
      this._isLoading.set(true);
      await this.delay(1500);
      
      const googleUser: User = {
        id: this.generateId(),
        email: 'user@gmail.com',
        firstName: 'Google',
        lastName: 'User',
        avatarUrl: 'https://via.placeholder.com/100x100?text=GU',
        roles: [],
        createdAt: new Date(),
        token: this.generateToken()
      };

      const mockToken = this.generateToken();
      
      this.storageService.set<User>(STORAGE_KEYS.USER, googleUser);
      this.storageService.setString(STORAGE_KEYS.TOKEN, mockToken);
      
      this._currentUser.set(googleUser);
      this._token.set(mockToken);
      this._isLoading.set(false);

      return { 
        success: true, 
        message: this.translationService.instant('messages.googleSignInSuccess') 
      };
    } catch (error) {
      this._isLoading.set(false);
      return { 
        success: false, 
        message: this.translationService.instant('messages.googleSignInFailed') 
      };
    }
  }

  async signInWithApple(): Promise<IAuthResponse> {
    try {
      this._isLoading.set(true);
      await this.delay(1500);
      
      const appleUser: User = {
        id: this.generateId(),
        email: 'user@icloud.com',
        firstName: 'Apple',
        lastName: 'User',
        avatarUrl: 'https://via.placeholder.com/100x100?text=AU',
        roles: [],
        createdAt: new Date(),
        token: ''
      };

      const mockToken = this.generateToken();
      
      this.storageService.set<User>(STORAGE_KEYS.USER, appleUser);
      this.storageService.setString(STORAGE_KEYS.TOKEN, mockToken);
      
      this._currentUser.set(appleUser);
      this._token.set(mockToken);
      this._isLoading.set(false);

      return { 
        success: true, 
        message: this.translationService.instant('messages.appleSignInSuccess') 
      };
    } catch (error) {
      this._isLoading.set(false);
      return { 
        success: false, 
        message: this.translationService.instant('messages.appleSignInFailed') 
      };
    }
  }

  async signOut(): Promise<void> {
    this.storageService.remove(STORAGE_KEYS.USER);
    this.storageService.remove(STORAGE_KEYS.TOKEN);
    this.storageService.remove(STORAGE_KEYS.SELECTED_ROLE);
    
    this._currentUser.set(null);
    this._token.set(null);
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private generateId(): number {
    return Math.floor(Math.random() * 1000000);
  }

  private generateToken(): string {
    return Math.random().toString(36).substr(2, 16);
  }
}
