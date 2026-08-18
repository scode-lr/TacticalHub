import { LOCALE_ID, Provider } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeCa from '@angular/common/locales/ca';
import localeEs from '@angular/common/locales/es';
import localeEn from '@angular/common/locales/en-GB';
import { STORAGE_KEYS } from '@core/constants/storage-keys';

const SUPPORTED = ['ca', 'es', 'en'] as const;
const DEFAULT_LOCALE = 'en';

/**
 * Angular ships only `en-US` locale data. Without registering the rest, `date`, `number` and
 * `currency` pipes silently format in English — so a Catalan app renders "Aug 15, 2026".
 */
registerLocaleData(localeCa, 'ca');
registerLocaleData(localeEs, 'es');
registerLocaleData(localeEn, 'en');

/**
 * Resolves the locale from the same storage the TranslationService writes to.
 *
 * Read synchronously rather than injected from that service on purpose: `LOCALE_ID` is needed
 * while the injector is built, long before the service finishes its async language detection.
 */
function resolveLocale(): string {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.FORCE_LANGUAGE)
      ?? localStorage.getItem(STORAGE_KEYS.LANGUAGE)
      ?? navigator.language;

    const language = (stored ?? DEFAULT_LOCALE).toLowerCase().split('-')[0];
    return (SUPPORTED as readonly string[]).includes(language) ? language : DEFAULT_LOCALE;
  } catch {
    // Private mode or a WebView with storage disabled: fall back rather than break bootstrap.
    return DEFAULT_LOCALE;
  }
}

export const localeProvider: Provider = {
  provide: LOCALE_ID,
  useFactory: resolveLocale,
};
