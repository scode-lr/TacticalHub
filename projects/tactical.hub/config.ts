import { translationsEn, translationsEs, translationsCa } from './i18n';

export const PROJECT_CONFIG = {
  name: 'Tactical Hub',
  taglineKey: 'app.tagline',
  appId: 'com.tactical.hub',
  translations: {
    en: translationsEn,
    es: translationsEs,
    ca: translationsCa
  },
  supportedLanguages: ['en', 'es', 'ca'] as string[],
  defaultLanguage: 'en' as string
};
