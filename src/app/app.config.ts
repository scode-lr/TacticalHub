import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { provideHttpClient } from '@angular/common/http';
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
    provideHttpClient(),
  ],
};