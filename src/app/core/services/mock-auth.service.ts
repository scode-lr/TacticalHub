import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { AuthResponse } from '../responses';
import { mockSignInResponse } from '../../../mocks';

@Injectable({
  providedIn: 'root'
})
export class MockAuthService {
  
  /**
   * Simulates a sign-in API call with a 2-second delay
   */
  signIn(email: string, password: string): Observable<AuthResponse> {
    // Simulate network delay (2 seconds)
    return of(mockSignInResponse).pipe(
      delay(2000)
    );
  }

  /**
   * Store auth data in localStorage
   */
  saveAuthData(authResponse: AuthResponse): void {
    localStorage.setItem('accessToken', authResponse.accessToken);
    localStorage.setItem('refreshToken', authResponse.refreshToken);
    localStorage.setItem('user', JSON.stringify(authResponse.user));
  }

  /**
   * Get stored user data
   */
  getStoredUser(): any {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  /**
   * Clear auth data
   */
  clearAuthData(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }
}
