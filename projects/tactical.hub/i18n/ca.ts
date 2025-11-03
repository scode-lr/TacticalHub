import { sharedTranslationsCa } from '../../shared/i18n';

export const translations = {
  ...sharedTranslationsCa,
  app: {
    name: 'Tactical Hub',
    tagline: 'Gestiona els teus equips i estratègies de futbol amb facilitat'
  }
} as const;

export type TranslationKeys = typeof translations;
