import { version } from '../package.json';
import { PROJECT_CONFIG } from '../config';

export const environment = {
  production: false,
    apiUrl: 'https://api-voltrega.tacticalhub.es',
  version,
  ...PROJECT_CONFIG
};
