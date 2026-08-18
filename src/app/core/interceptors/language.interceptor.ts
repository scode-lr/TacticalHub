import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TranslationService } from '../services/i18n/translation.service';

/**
 * languageInterceptor
 *
 * Sends the language the user picked *inside the app* as `Accept-Language`.
 *
 * Without this the API sees whatever the browser or WebView negotiates, which is the device
 * language and has nothing to do with the in-app setting. That is not only a wording mismatch:
 * the API stores the request culture on a form submission and prints generated documents in it,
 * so a member reading the app in Catalan would sign — and receive — a Spanish document.
 */
export const languageInterceptor: HttpInterceptorFn = (req, next) => {
  const translationService = inject(TranslationService);
  const language = translationService.getCurrentLanguage();

  if (!language) {
    return next(req);
  }

  return next(req.clone({ setHeaders: { 'Accept-Language': language } }));
};
