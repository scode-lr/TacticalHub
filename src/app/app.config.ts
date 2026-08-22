import { ApplicationConfig, provideAppInitializer, inject } from '@angular/core';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { languageInterceptor } from './core/interceptors/language.interceptor';
import { localeProvider } from './core/i18n/locale.provider';
import { AuthService } from './core/services/auth.service';
import { TranslationService } from './core/services/i18n/translation.service';
import { environment } from '@environment';
import { Animation, AnimationController } from '@ionic/angular/standalone';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';

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
    localeProvider,
    provideIonicAngular({
      navAnimation: customNavAnimation
    }),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideHttpClient(withInterceptors([languageInterceptor, authInterceptor])),
    /**
     * Runs before any route guard is evaluated, so no page can render (and no `| translate` pipe
     * can run) with the translations dictionary still empty — that was showing raw keys like
     * "user.menu.forms" on a slow cold start, when the first route rendered before AppComponent's
     * own ngOnInit got around to loading them.
     */
    provideAppInitializer(() => inject(TranslationService).initialize({
      translations: environment.translations,
      supportedLanguages: environment.supportedLanguages,
      defaultLanguage: environment.defaultLanguage
    })),
    /**
     * Runs before any route guard is evaluated.
     * Attempts a silent token refresh via the HttpOnly refresh-token cookie.
     * On success the access token is in memory; on failure the stale cache
     * is cleared and the auth guard redirects to sign-in.
     */
    provideAppInitializer(() => inject(AuthService).initializeAuth()),
    providePrimeNG({
            theme: {
                preset: Aura,
                options: {
                    darkModeSelector: false
                }
            }
        })
  ],
};
