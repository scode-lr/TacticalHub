import { PROJECT_CONFIG } from '../config';

export const environment = {
  production: true,
  apiUrl: 'https://api.tactical.hub',
  version: '1.0.0',
  ...PROJECT_CONFIG
};
