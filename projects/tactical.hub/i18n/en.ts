import { sharedTranslationsEn } from '../../shared/i18n';

export const translations = {
  ...sharedTranslationsEn,
  app: {
    name: 'Tactical Hub',
    tagline: 'Manage your football teams and strategies with ease'
  }
} as const;

export type TranslationKeys = typeof translations;
