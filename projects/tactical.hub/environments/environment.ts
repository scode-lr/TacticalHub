import { PROJECT_CONFIG } from '../config';

export const environment = {
  production: false,
  apiUrl: 'https://api-dev.tactical.hub',
  version: '1.0.0',
  ...PROJECT_CONFIG
};
