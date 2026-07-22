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

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1),
});

export const changePasswordSchema = z.object({
  currentPassword: z
    .string()
    .min(8),

  newPassword: z
    .string()
    .min(8)
    .max(100)
    .regex(/[A-Z]/, 'Password must contain one uppercase letter')
    .regex(/[a-z]/, 'Password must contain one lowercase letter')
    .regex(/[0-9]/, 'Password must contain one number')
    .regex(
      /[^A-Za-z0-9]/,
      'Password must contain one special character',
    ),
})
.refine(
  (data) => data.currentPassword !== data.newPassword,
  {
    message:
      'New password must be different from current password',
    path: ['newPassword'],
  },
);
export type RefreshTokenDto = z.infer<typeof refreshTokenSchema>;
export type LoginDto = z.infer<typeof loginSchema>;
export type RegisterDto = z.infer<typeof registerSchema>;
export type ChangePasswordDto = z.infer<typeof changePasswordSchema>;