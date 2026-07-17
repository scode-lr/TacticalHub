import { PROJECT_CONFIG } from '../config';

export const environment = {
  production: false,
  // apiUrl: 'https://localhost:7258',
  apiUrl: 'https://api-dev-voltrega.tacticalhub.es',
  version: '1.0.0',
  ...PROJECT_CONFIG
};
