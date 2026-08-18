import { bootstrapApplication } from '@angular/platform-browser';
import { Capacitor } from '@capacitor/core';
import { SplashScreen } from '@capacitor/splash-screen';
import { NavigationEnd, Router } from '@angular/router';
import { filter, firstValueFrom, take } from 'rxjs';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

const SPLASH_FALLBACK_MS = 7000;
const isNativePlatform = Capacitor.isNativePlatform();

let splashHidden = false;
let splashFallback: ReturnType<typeof setTimeout> | undefined;

const hideSplash = async (): Promise<void> => {
  if (!isNativePlatform || splashHidden) {
    return;
  }

  splashHidden = true;

  if (splashFallback) {
    clearTimeout(splashFallback);
  }

  try {
    await SplashScreen.hide();
  } catch (error) {
    console.warn('Unable to hide the native splash screen', error);
  }
};

const waitForInitialNavigation = async (router: Router): Promise<void> => {
  if (router.navigated) {
    return;
  }

  await firstValueFrom(
    router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      take(1)
    )
  );
};

const waitForPaint = (): Promise<void> => new Promise(resolve => {
  requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
});

if (isNativePlatform) {
  splashFallback = setTimeout(() => {
    void hideSplash();
  }, SPLASH_FALLBACK_MS);
}

void bootstrapApplication(AppComponent, appConfig)
  .then(async appRef => {
    const router = appRef.injector.get(Router);

    await waitForInitialNavigation(router);
    await waitForPaint();
    await hideSplash();
  })
  .catch(async error => {
    await hideSplash();
    console.error(error);
  });
