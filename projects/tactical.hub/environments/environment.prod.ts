import { PROJECT_CONFIG } from '../config';

export const environment = {
  production: true,
  projectName: PROJECT_CONFIG.name,
  taglineKey: PROJECT_CONFIG.taglineKey,
  appId: PROJECT_CONFIG.appId,
  version: PROJECT_CONFIG.version,
  apiUrl: 'https://api.tactical.hub',
  translations: PROJECT_CONFIG.translations,
  features: {
    analytics: true,
    pushNotifications: true
  }
};
