import { ApplicationConfig, provideAppInitializer, inject } from '@angular/core';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { AuthService } from './core/services/auth.service';
import { Animation, AnimationController } from '@ionic/angular/standalone';

import { routes } from './app.routes';

const customNavAnimation = (baseEl: HTMLElement, opts?: any): Animation => {
  const animationCtrl = new AnimationController();
  
  if (window.matchMedia('(min-width: 768px)').matches) {
    return animationCtrl.create()
      .duration(0);
  }
  
  return animationCtrl.create()
    .addElement(opts.enteringEl)
    .duration(300)
    .easing('ease-in-out')
    .fromTo('opacity', 0, 1);
};

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular({
      navAnimation: customNavAnimation
    }),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideHttpClient(withInterceptors([authInterceptor])),
    /**
     * Runs before any route guard is evaluated.
     * Attempts a silent token refresh via the HttpOnly refresh-token cookie.
     * On success the access token is in memory; on failure the stale cache
     * is cleared and the auth guard redirects to sign-in.
     */
    provideAppInitializer(() => inject(AuthService).initializeAuth()),
  ],
};