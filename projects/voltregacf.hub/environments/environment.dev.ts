import { version } from '../package.json';
import { PROJECT_CONFIG } from '../config';

export const environment = {
  production: false,
  apiUrl: 'https://localhost:7258',
  version,
  ...PROJECT_CONFIG
};
