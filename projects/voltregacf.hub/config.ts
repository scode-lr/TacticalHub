import { translationsEn, translationsEs, translationsCa } from './i18n';

export const PROJECT_CONFIG = {
  name: 'Voltrega CF',
  taglineKey: 'app.tagline',
  appId: 'com.voltregacf.hub',
  clubId: 'voltrega-cf',
  selectedClubId: 1,
  private: true,
  translations: {
    en: translationsEn,
    es: translationsEs,
    ca: translationsCa
  },
  supportedLanguages: ['en', 'es', 'ca'] as string[],
  defaultLanguage: 'ca' as string
};
