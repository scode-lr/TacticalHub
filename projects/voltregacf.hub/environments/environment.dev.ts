import { PROJECT_CONFIG } from '../config';

export const environment = {
  production: false,
  apiUrl: 'https://localhost:7258',
  version: '1.0.0',
  ...PROJECT_CONFIG
};
