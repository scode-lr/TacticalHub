import { version } from '../package.json';
import { PROJECT_CONFIG } from '../config';

export const environment = {
  production: false,
  apiUrl: 'https://api-dev-voltrega.tacticalhub.es',
  version,
  ...PROJECT_CONFIG
};
