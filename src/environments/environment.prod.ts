export const environment = {
  production: true,
  projectName: 'Tactical Hub',
  taglineKey: 'app.tagline',
  appId: 'com.tactical.hub',
  private: false,
  version: '1.0.0',
  apiUrl: 'https://api.tactical.hub',
  translations: {
    en: { app: { name: 'Tactical Hub', tagline: 'Manage your football teams' } },
    es: { app: { name: 'Tactical Hub', tagline: 'Gestiona tus equipos' } },
    ca: { app: { name: 'Tactical Hub', tagline: 'Gestiona els teus equips' } }
  },
  supportedLanguages: ['en', 'es', 'ca'],
  defaultLanguage: 'en',
  features: {
    analytics: true,
    pushNotifications: true
  }
};
