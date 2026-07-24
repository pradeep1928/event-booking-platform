import { z } from 'zod';
import { Role } from '@prisma/client'


const accessTokenPayloadSchema = z.object({
  sub: z.string(),
  email: z.string().email(),
  role: z.enum(Role),
});

export const refreshTokenPayloadSchema = z.object({
  sub: z.string(),
  jti: z.string(),
});

export type AccessTokenPayload = z.infer<typeof accessTokenPayloadSchema>;
export type RefreshTokenPayload = z.infer<typeof refreshTokenPayloadSchema>;
