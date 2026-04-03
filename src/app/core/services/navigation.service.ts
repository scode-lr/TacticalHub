import { Injectable, inject } from '@angular/core';
import { Router, NavigationExtras, ActivatedRouteSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private readonly router = inject(Router);
  
  navigateTo(path: string[], extras?: NavigationExtras): Promise<boolean> {
    return this.router.navigate(path, extras);
  }
  
  goBack(): void {
    window.history.back();
  }
  
  extractRoleDetails(): {roleType: number, roleId: number} {
    const roleId = this.findRouteParam('roleId');
    const roleType = this.findRouteData('roleType');
    
    if (!roleId || !roleType) {
      return { roleType: 0, roleId: 0 };
    }
    
    return { roleType: Number(roleType), roleId: Number(roleId) };
  }

  findRouteParam(paramName: string): string | null {
    let route: ActivatedRouteSnapshot | null = this.router.routerState.snapshot.root;
    
    while (route) {
      const param = route.paramMap.get(paramName);
      if (param) {
        return param;
      }
      route = route.firstChild;
    }
    
    return null;
  }

  private findRouteData(dataKey: string): any {
    let route: ActivatedRouteSnapshot | null = this.router.routerState.snapshot.root;
    
    while (route) {
      if (route.data[dataKey] !== undefined) {
        return route.data[dataKey];
      }
      route = route.firstChild;
    }
    
    return null;
  }

  getMenuIdFromUrl(): string {
    const url = this.router.url;
    const segments = url.split('/').filter(s => s && !s.match(/^\d+$/));
    
    const menuSegmentIndex = segments.findIndex(s => s === 'app');
    if (menuSegmentIndex !== -1 && menuSegmentIndex + 1 < segments.length) {
      return segments[menuSegmentIndex + 1];
    }
    
    return 'home';
  }
}
