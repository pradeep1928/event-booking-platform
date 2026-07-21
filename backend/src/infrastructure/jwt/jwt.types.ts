import type { JWTPayload } from 'jose';

export interface AccessTokenPayload  extends JWTPayload {
  sub: string;
  email: string;
  role: string;
}

export interface RefreshTokenPayload extends JWTPayload {
  sub: string;
  jti: string;
}