import { Injectable, inject } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private readonly router = inject(Router);

  navigateTo(path: string[], extras?: NavigationExtras): Promise<boolean> {
    console.log('➡️ Navigating to:', path, extras || {});
    return this.router.navigate(path, extras);
  }

  goBack(): void {
    window.history.back();
  }
}
