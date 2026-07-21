import { env } from './env.js';

export const appConfig = {
  host: env.HOST,
  port: env.PORT,
  nodeEnv: env.NODE_ENV,
};