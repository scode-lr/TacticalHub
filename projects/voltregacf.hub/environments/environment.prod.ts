import { version } from '../package.json';
import { PROJECT_CONFIG } from '../config';

export const environment = {
  production: true,
  apiUrl: 'https://api-voltregacf.tacticalhub.es',
  version,
  ...PROJECT_CONFIG
};
