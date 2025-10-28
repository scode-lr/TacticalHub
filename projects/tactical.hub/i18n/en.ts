export const translations = {
  app: {
    name: 'Tactical Hub',
    tagline: 'Manage your football teams and strategies with ease'
  }
} as const;

export type TranslationKeys = typeof translations;
