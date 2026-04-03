import { PROJECT_CONFIG } from '../config';

export const environment = {
  production: false,
  apiUrl: 'http://localhost:5197',
  version: '1.0.0',
  ...PROJECT_CONFIG
};
