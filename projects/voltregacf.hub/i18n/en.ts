// Voltrega CF Hub - English Translations (Project-Specific)
// This file contains ONLY project-specific translatable strings
// Common/shared strings are inherited from src/app/core/i18n/shared
// These translations will override shared ones if keys conflict

export const translations = {
  app: {
    name: 'Voltrega CF Hub',
    tagline: 'Grow together'
  }
  // All other translations (welcome, auth, common) are inherited from shared
  // You can override shared translations here if needed:
  // welcome: {
  //   createAccount: 'Join Voltrega'  // This would override shared
  // }
} as const;

export type TranslationKeys = typeof translations;
