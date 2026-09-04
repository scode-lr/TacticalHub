import { version } from '../package.json';
import { PROJECT_CONFIG } from '../config';

export const environment = {
  production: false,
  apiUrl: 'http://192.168.1.51:7258',
  version,
  ...PROJECT_CONFIG
};
