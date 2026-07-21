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

  DATABASE_URL: z.string(),

  JWT_ACCESS_SECRET: z.string().min(32),

  JWT_REFRESH_SECRET: z.string().min(32),

  JWT_ACCESS_EXPIRES_IN: z.string(),

  JWT_REFRESH_EXPIRES_IN: z.string(),

  BCRYPT_SALT_ROUNDS: z.coerce.number(),

  REDIS_URL: z.string(),
});

export const env = envSchema.parse(process.env);