import { sharedTranslationsEs } from '../../shared/i18n';

export const translations = {
  ...sharedTranslationsEs,
  app: {
    name: 'Voltrega CF Hub',
    tagline: 'Crecer juntos'
  }
} as const;

export type TranslationKeys = typeof translations;
