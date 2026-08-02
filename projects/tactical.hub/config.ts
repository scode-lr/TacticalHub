import { translationsEn, translationsEs, translationsCa } from './i18n';

export const PROJECT_CONFIG = {
  name: 'Tactical',
  taglineKey: 'app.tagline',
  appId: 'com.tactical.hub',
  logoUrl: 'assets/icon/logo.svg',
  private: false,
  translations: {
    en: translationsEn,
    es: translationsEs,
    ca: translationsCa
  },
  supportedLanguages: ['en', 'es', 'ca'] as string[],
  defaultLanguage: 'en' as string
};
