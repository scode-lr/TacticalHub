import { Injectable, signal, computed } from '@angular/core';
import { User } from '../models';
import { SignInRequest, SignUpRequest } from '../requests/auth.request';
import { mockUsers } from '../../../mocks/user.mock';

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
  private readonly _currentUser = signal<User | null>(null);
  private readonly _token = signal<string | null>(null);
  private readonly _isLoading = signal<boolean>(false);

  readonly isLoading = this._isLoading.asReadonly();
  readonly isAuthenticated = computed(() => this._currentUser() !== null && this._token() !== null);
  readonly hasClub = computed(() => {
    const user = this._currentUser();
    return !!(user && user.roles?.some(role => role.name === 'CLUB_MEMBER'));
  });

  constructor() {
    this.checkStoredAuth();
  }

  private checkStoredAuth(): void {
    const storedUser = localStorage.getItem('tacticalhub_user');
    const storedToken = localStorage.getItem('tacticalhub_token');
    
    if (storedUser && storedToken) {
      const user = JSON.parse(storedUser);
      this._currentUser.set(user);
      this._token.set(storedToken);
    }
  }

  async signIn(credentials: SignInRequest): Promise<IAuthResponse> {
    try {
      this._isLoading.set(true);
      await this.delay(1500);
      
      if (!credentials.email || credentials.password.length < 6) {
        this._isLoading.set(false);
        return { success: false, message: 'Invalid credentials' };
      }

      const foundUser = mockUsers.find(user => user.email === credentials.email);
      
      if (!foundUser) {
        this._isLoading.set(false);
        return { success: false, message: 'User not found. Please check your email.' };
      }

      const mockToken = this.generateToken();
      
      localStorage.setItem('tacticalhub_user', JSON.stringify(foundUser));
      localStorage.setItem('tacticalhub_token', mockToken);
      
      this._currentUser.set(foundUser);
      this._token.set(mockToken);
      this._isLoading.set(false);

      return { success: true, message: 'Sign in successful!' };
    } catch (error) {
      this._isLoading.set(false);
      return { success: false, message: 'Sign in failed. Please try again.' };
    }
  }

  async signUp(userData: SignUpRequest): Promise<IAuthResponse> {
    try {
      this._isLoading.set(true);
      await this.delay(2000);
      
      if (userData.email && userData.password.length >= 6) {
        const newUser = new User();
        newUser.id = this.generateId();
        newUser.email = userData.email;
        newUser.firstName = userData.firstName;
        newUser.lastName = userData.lastName;
        newUser.roles = [];
        newUser.createdAt = new Date();

        const mockToken = this.generateToken();
        
        localStorage.setItem('tacticalhub_user', JSON.stringify(newUser));
        localStorage.setItem('tacticalhub_token', mockToken);
        
        this._currentUser.set(newUser);
        this._token.set(mockToken);
        this._isLoading.set(false);

        return { success: true, message: 'Account created successfully!' };
      } else {
        this._isLoading.set(false);
        return { success: false, message: 'Invalid user data' };
      }
    } catch (error) {
      this._isLoading.set(false);
      return { success: false, message: 'Registration failed. Please try again.' };
    }
  }

  async signInWithGoogle(): Promise<IAuthResponse> {
    try {
      this._isLoading.set(true);
      await this.delay(1500);
      
      const googleUser = new User();
      googleUser.id = this.generateId();
      googleUser.email = 'user@gmail.com';
      googleUser.firstName = 'Google';
      googleUser.lastName = 'User';
      googleUser.avatarUrl = 'https://via.placeholder.com/100x100?text=GU';
      googleUser.roles = [];
      googleUser.createdAt = new Date();

      const mockToken = this.generateToken();
      
      localStorage.setItem('tacticalhub_user', JSON.stringify(googleUser));
      localStorage.setItem('tacticalhub_token', mockToken);
      
      this._currentUser.set(googleUser);
      this._token.set(mockToken);
      this._isLoading.set(false);

      return { success: true, message: 'Google sign-in successful!' };
    } catch (error) {
      this._isLoading.set(false);
      return { success: false, message: 'Google sign-in failed' };
    }
  }

  async signInWithApple(): Promise<IAuthResponse> {
    try {
      this._isLoading.set(true);
      await this.delay(1500);
      
      const appleUser = new User();
      appleUser.id = this.generateId();
      appleUser.email = 'user@icloud.com';
      appleUser.firstName = 'Apple';
      appleUser.lastName = 'User';
      appleUser.avatarUrl = 'https://via.placeholder.com/100x100?text=AU';
      appleUser.roles = [];
      appleUser.createdAt = new Date();

      const mockToken = this.generateToken();
      
      localStorage.setItem('tacticalhub_user', JSON.stringify(appleUser));
      localStorage.setItem('tacticalhub_token', mockToken);
      
      this._currentUser.set(appleUser);
      this._token.set(mockToken);
      this._isLoading.set(false);

      return { success: true, message: 'Apple sign-in successful!' };
    } catch (error) {
      this._isLoading.set(false);
      return { success: false, message: 'Apple sign-in failed' };
    }
  }

  async signOut(): Promise<void> {
    localStorage.removeItem('tacticalhub_user');
    localStorage.removeItem('tacticalhub_token');
    
    this._currentUser.set(null);
    this._token.set(null);
  }

  async joinClub(clubId: string, clubName: string): Promise<IAuthResponse> {
    try {
      const current = this._currentUser();
      if (!current) {
        return { success: false, message: 'User not authenticated' };
      }

      this._isLoading.set(true);
      await this.delay(1000);

      const updatedUser = Object.assign(new User(), current);
      localStorage.setItem('tacticalhub_user', JSON.stringify(updatedUser));
      this._currentUser.set(updatedUser);
      this._isLoading.set(false);

      return { success: true, message: `Successfully joined ${clubName}!` };
    } catch (error) {
      this._isLoading.set(false);
      return { success: false, message: 'Failed to join club' };
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private generateId(): string {
    return 'user_' + Math.random().toString(36).substr(2, 9);
  }

  private generateToken(): string {
    return 'token_' + Math.random().toString(36).substr(2, 16);
  }
}
