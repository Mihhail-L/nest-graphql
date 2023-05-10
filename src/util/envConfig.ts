import { getConfig, getNumberConfig } from './envHelper';

export const MYSQL_USERNAME = getConfig('MYSQL_USERNAME', false, 'root');

export const MYSQL_PASSWORD = getConfig('MYSQL_PASSWORD', false, '');

export const MYSQL_HOST = getConfig('MYSQL_HOST', false, 'localhost');

export const MYSQL_PORT = getNumberConfig('MYSQL_PORT', false, 3306);

export const MYSQL_DATABASE = getConfig('MYSQL_DATABASE', false, 'skeleton-db');

export const NODE_ENV = getConfig('NODE_ENV', false, 'development');

export const PORT = getNumberConfig('PORT', false, 3000);
