import { sharedTranslationsEn } from '../../shared/i18n';

export const translations = {
  ...sharedTranslationsEn,
  app: {
    name: 'Voltrega CF Hub',
    tagline: 'Grow together'
  }
} as const;

export type TranslationKeys = typeof translations;
