
import { env } from './env.js';

export const mailConfig = {
  host: env.MAIL_HOST,

  port: env.MAIL_PORT,

  user: env.MAIL_USER,

  password: env.MAIL_PASSWORD,

  from: env.MAIL_FROM,

  appUrl: env.APP_URL,
};