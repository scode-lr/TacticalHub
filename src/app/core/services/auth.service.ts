import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profileImage?: string;
  clubId?: string;
  clubName?: string;
  joinedAt: Date;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
}

export interface SignInRequest {
  email: string;
  password: string;
}

export interface SignUpRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authStateSubject = new BehaviorSubject<AuthState>({
    isAuthenticated: false,
    user: null,
    token: null
  });

  public authState$ = this.authStateSubject.asObservable();

  constructor() {
    this.checkStoredAuth();
  }

  private checkStoredAuth(): void {
    const storedUser = localStorage.getItem('tacticalhub_user');
    const storedToken = localStorage.getItem('tacticalhub_token');
    
    if (storedUser && storedToken) {
      const user = JSON.parse(storedUser);
      this.authStateSubject.next({
        isAuthenticated: true,
        user,
        token: storedToken
      });
    }
  }

  async signIn(credentials: SignInRequest): Promise<{ success: boolean; message: string }> {
    try {
      // Simulate API call
      await this.delay(1500);
      
      // Mock authentication logic
      if (credentials.email && credentials.password.length >= 6) {
        const mockUser: User = {
          id: this.generateId(),
          email: credentials.email,
          firstName: 'John',
          lastName: 'Doe',
          clubId: Math.random() > 0.5 ? 'club-123' : undefined,
          clubName: Math.random() > 0.5 ? 'FC Barcelona Youth' : undefined,
          joinedAt: new Date()
        };

        const mockToken = this.generateToken();
        
        // Store in localStorage
        localStorage.setItem('tacticalhub_user', JSON.stringify(mockUser));
        localStorage.setItem('tacticalhub_token', mockToken);
        
        // Update auth state
        this.authStateSubject.next({
          isAuthenticated: true,
          user: mockUser,
          token: mockToken
        });

        return { success: true, message: 'Sign in successful!' };
      } else {
        return { success: false, message: 'Invalid credentials' };
      }
    } catch (error) {
      return { success: false, message: 'Sign in failed. Please try again.' };
    }
  }

  async signUp(userData: SignUpRequest): Promise<{ success: boolean; message: string }> {
    try {
      // Simulate API call
      await this.delay(2000);
      
      // Mock registration logic
      if (userData.email && userData.password.length >= 6) {
        const newUser: User = {
          id: this.generateId(),
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          // New users don't have a club initially
          clubId: undefined,
          clubName: undefined,
          joinedAt: new Date()
        };

        const mockToken = this.generateToken();
        
        // Store in localStorage
        localStorage.setItem('tacticalhub_user', JSON.stringify(newUser));
        localStorage.setItem('tacticalhub_token', mockToken);
        
        // Update auth state
        this.authStateSubject.next({
          isAuthenticated: true,
          user: newUser,
          token: mockToken
        });

        return { success: true, message: 'Account created successfully!' };
      } else {
        return { success: false, message: 'Invalid user data' };
      }
    } catch (error) {
      return { success: false, message: 'Registration failed. Please try again.' };
    }
  }

  async signInWithGoogle(): Promise<{ success: boolean; message: string }> {
    try {
      // Simulate Google sign-in
      await this.delay(1500);
      
      const googleUser: User = {
        id: this.generateId(),
        email: 'user@gmail.com',
        firstName: 'Google',
        lastName: 'User',
        profileImage: 'https://via.placeholder.com/100x100?text=GU',
        clubId: undefined,
        clubName: undefined,
        joinedAt: new Date()
      };

      const mockToken = this.generateToken();
      
      localStorage.setItem('tacticalhub_user', JSON.stringify(googleUser));
      localStorage.setItem('tacticalhub_token', mockToken);
      
      this.authStateSubject.next({
        isAuthenticated: true,
        user: googleUser,
        token: mockToken
      });

      return { success: true, message: 'Google sign-in successful!' };
    } catch (error) {
      return { success: false, message: 'Google sign-in failed' };
    }
  }

  async signInWithApple(): Promise<{ success: boolean; message: string }> {
    try {
      // Simulate Apple sign-in
      await this.delay(1500);
      
      const appleUser: User = {
        id: this.generateId(),
        email: 'user@icloud.com',
        firstName: 'Apple',
        lastName: 'User',
        profileImage: 'https://via.placeholder.com/100x100?text=AU',
        clubId: undefined,
        clubName: undefined,
        joinedAt: new Date()
      };

      const mockToken = this.generateToken();
      
      localStorage.setItem('tacticalhub_user', JSON.stringify(appleUser));
      localStorage.setItem('tacticalhub_token', mockToken);
      
      this.authStateSubject.next({
        isAuthenticated: true,
        user: appleUser,
        token: mockToken
      });

      return { success: true, message: 'Apple sign-in successful!' };
    } catch (error) {
      return { success: false, message: 'Apple sign-in failed' };
    }
  }

  async signOut(): Promise<void> {
    // Clear localStorage
    localStorage.removeItem('tacticalhub_user');
    localStorage.removeItem('tacticalhub_token');
    
    // Reset auth state
    this.authStateSubject.next({
      isAuthenticated: false,
      user: null,
      token: null
    });
  }

  getCurrentUser(): User | null {
    return this.authStateSubject.value.user;
  }

  isAuthenticated(): boolean {
    return this.authStateSubject.value.isAuthenticated;
  }

  hasClub(): boolean {
    const user = this.getCurrentUser();
    return !!(user?.clubId);
  }

  async joinClub(clubId: string, clubName: string): Promise<{ success: boolean; message: string }> {
    try {
      const currentUser = this.getCurrentUser();
      if (!currentUser) {
        return { success: false, message: 'User not authenticated' };
      }

      // Simulate API call
      await this.delay(1000);

      const updatedUser: User = {
        ...currentUser,
        clubId,
        clubName
      };

      localStorage.setItem('tacticalhub_user', JSON.stringify(updatedUser));

      this.authStateSubject.next({
        isAuthenticated: true,
        user: updatedUser,
        token: this.authStateSubject.value.token
      });

      return { success: true, message: `Successfully joined ${clubName}!` };
    } catch (error) {
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
