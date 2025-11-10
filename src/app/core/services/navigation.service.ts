import { Injectable, inject } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private readonly router = inject(Router);

  /**
   * Generic navigation method
   * @param path - Array of path segments (e.g., ['/auth/signin'] or ['/team', teamId])
   * @param extras - Optional navigation extras (queryParams, state, etc.)
   */
  navigateTo(path: string[], extras?: NavigationExtras): Promise<boolean> {
    return this.router.navigate(path, extras);
  }

  /**
   * Navigate back in browser history
   */
  goBack(): void {
    window.history.back();
  }
}
