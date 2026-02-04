import { Injectable, signal, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { User } from '../models';
import { SignInRequest, SignUpRequest } from '../requests/auth.request';
import { SignInResponse, SignUpResponse } from '../responses/auth.response';
import { STORAGE_KEYS } from '../constants/storage-keys';
import { TranslationService } from './i18n/translation.service';
import { StorageService } from './storage.service';
import { ApiService } from './api.service';

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
  private readonly apiService = inject(ApiService);
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
      
      if (!credentials.email || credentials.password.length < 6) {
        this._isLoading.set(false);
        return { 
          success: false, 
          message: this.translationService.instant('validation.checkInput') 
        };
      }

      const response = await firstValueFrom(
        this.apiService.post<SignInResponse>('/auth/signin', {
          email: credentials.email,
          password: credentials.password,
          rememberMe: credentials.rememberMe
        })
      );

      console.log('SignIn Response:', response);
      if (response.success && response.data) {
        const { user, token } = response.data;

        this.storageService.set<User>(STORAGE_KEYS.USER, user);
        this.storageService.setString(STORAGE_KEYS.TOKEN, token);
        
        this._currentUser.set(user);
        this._token.set(token);
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
    let message;
    let success;

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
        this.apiService.post<SignUpResponse>('/auth/signup', {
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
        this.storageService.set<User>(STORAGE_KEYS.USER, user);
        this.storageService.setString(STORAGE_KEYS.TOKEN, token);
        
        this._currentUser.set(user);
        this._token.set(token);
      }

      message = response.message;
      success = response.success;
      
    } catch (error: any) {
      message = error.message || this.translationService.instant('messages.signUpError');
      success = false;
    }
    
    this._isLoading.set(false);

    return { 
        success, 
        message
      };
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
    let message;
    let success;

    try {
      this._isLoading.set(true);

      const response = await firstValueFrom(
        this.apiService.post<SignInResponse>('/auth/guest', {})
      );

      if (response.success && response.data) {
        const { user, token } = response.data;

        this.storageService.set<User>(STORAGE_KEYS.USER, user);
        this.storageService.setString(STORAGE_KEYS.TOKEN, token);
        
        this._currentUser.set(user);
        this._token.set(token);
      }

      message = response.message;
      success = response.success;
    } catch (error: any) {
      message = error.message || this.translationService.instant('messages.guestLoginError');
      success = false;
    }
    this._isLoading.set(false);

    return { 
      success, 
      message
    };
  }

  async signOut(): Promise<void> {
    try {
      // Optional: call logout endpoint on backend
      // await firstValueFrom(this.apiService.post('/auth/logout', {}));
      
      this.storageService.remove(STORAGE_KEYS.USER);
      this.storageService.remove(STORAGE_KEYS.TOKEN);
      this.storageService.remove(STORAGE_KEYS.SELECTED_ROLE);
      
      this._currentUser.set(null);
      this._token.set(null);
    } catch (error) {
      // Perform local logout even if backend fails
      this.storageService.remove(STORAGE_KEYS.USER);
      this.storageService.remove(STORAGE_KEYS.TOKEN);
      this.storageService.remove(STORAGE_KEYS.SELECTED_ROLE);
      
      this._currentUser.set(null);
      this._token.set(null);
    }
  }
}
