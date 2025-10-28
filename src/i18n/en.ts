// Default - English Translations (Tactical Hub - Project-Specific)
// This file contains ONLY project-specific translatable strings
// Common/shared strings are inherited from src/app/core/i18n/shared

export const translations = {
  app: {
    name: 'Tactical Hub',
    tagline: 'Manage your football teams and strategies with ease'
  }
  // All other translations (welcome, auth, common) are inherited from shared
} as const;

export type TranslationKeys = typeof translations;
