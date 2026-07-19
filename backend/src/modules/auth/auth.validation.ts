import { z } from 'zod';

export const registerSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, 'First name must contain at least 2 characters')
    .max(50),

  lastName: z
    .string()
    .trim()
    .min(2, 'Last name must contain at least 2 characters')
    .max(50),

  email: z
    .email()
    .trim()
    .toLowerCase(),

  password: z
    .string()
    .min(8)
    .max(100)
    .regex(/[A-Z]/, 'Password must contain one uppercase letter')
    .regex(/[a-z]/, 'Password must contain one lowercase letter')
    .regex(/[0-9]/, 'Password must contain one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain one special character'),
});

export type RegisterDto = z.infer<typeof registerSchema>;