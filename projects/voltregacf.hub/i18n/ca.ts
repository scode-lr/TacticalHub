import { sharedTranslationsCa } from '../../shared/i18n';

export const translations = {
  ...sharedTranslationsCa,
  app: {
    name: 'Voltrega CF Hub',
    tagline: 'Créixer junts'
  }
} as const;

export type TranslationKeys = typeof translations;
