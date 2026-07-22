import { z } from 'zod';


const accessTokenPayloadSchema = z.object({
  sub: z.string(),
  email: z.string().email(),
  role: z.enum(["USER", "ADMIN"]),
});

export const refreshTokenPayloadSchema = z.object({
  sub: z.string(),
  jti: z.string(),
});

export type AccessTokenPayload = z.infer<typeof accessTokenPayloadSchema>;
export type RefreshTokenPayload = z.infer<typeof refreshTokenPayloadSchema>;
