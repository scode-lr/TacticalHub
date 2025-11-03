import { sharedTranslationsEs } from '../../shared/i18n';

export const translations = {
  ...sharedTranslationsEs,
  app: {
    name: 'Tactical Hub',
    tagline: 'Gestiona tus equipos y estrategias de fútbol con facilidad'
  }
} as const;

export type TranslationKeys = typeof translations;
