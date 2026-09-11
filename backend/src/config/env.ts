import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum([
    'development',
    'production',
    'test',
  ]),

  PORT: z.coerce.number(),

  HOST: z.string(),

  FRONTEND_URL: z.string(),

  DATABASE_URL: z.string(),

  JWT_ACCESS_SECRET: z.string().min(32),

  JWT_REFRESH_SECRET: z.string().min(32),

  JWT_ACCESS_EXPIRES_IN: z.string(),

  JWT_REFRESH_EXPIRES_IN: z.string(),

  BCRYPT_SALT_ROUNDS: z.coerce.number(),

  REDIS_URL: z.string(),

  // mail configuaration
  MAIL_HOST: z.string().min(1),
  MAIL_PORT: z.coerce.number().int().positive(),
  MAIL_USER: z.string().email(),
  MAIL_PASSWORD: z.string().min(1),
  MAIL_FROM: z.string().min(1),
  APP_URL: z.string().url(),
});

export const env = envSchema.parse(process.env);