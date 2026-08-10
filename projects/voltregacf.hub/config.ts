import { translationsEn, translationsEs, translationsCa } from './i18n';

export const PROJECT_CONFIG = {
  name: 'Voltregà CF',
  taglineKey: 'app.tagline',
  appId: 'es.tacticalhub.voltrega',
  clubId: 1,
  logoUrl: 'assets/icon/icon.svg',
  private: true, 
  translations: {
    en: translationsEn,
    es: translationsEs,
    ca: translationsCa
  },
  supportedLanguages: ['en', 'es', 'ca'] as string[],
  defaultLanguage: 'ca' as string
};
