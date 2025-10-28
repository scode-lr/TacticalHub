// Default Project Configuration (Tactical Hub)
// This file contains project-specific constants and configuration

import { translations } from './i18n';

export const PROJECT_CONFIG = {
  name: translations.app.name,
  taglineKey: 'app.tagline',
  appId: 'com.tactical.hub',
  version: '1.0.0',
  translations
} as const;
