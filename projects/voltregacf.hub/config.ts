// Voltrega CF Hub Project Configuration
// This file contains project-specific constants and configuration

import { translations } from './i18n';

export const PROJECT_CONFIG = {
  name: translations.app.name,
  taglineKey: 'app.tagline', // Translation key for easy migration
  appId: 'com.voltregacf.hub',
  clubId: 'voltrega-cf',
  version: '1.0.0',
  // Include translations for the translation service
  translations
} as const;
