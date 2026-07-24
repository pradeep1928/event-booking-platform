import type { JWTPayload } from 'jose';
import { Role } from '@prisma/client'

export interface AccessTokenPayload  extends JWTPayload {
  sub: string;
  email: string;
  role: Role;
}

export interface RefreshTokenPayload extends JWTPayload {
  sub: string;
  jti: string;
}