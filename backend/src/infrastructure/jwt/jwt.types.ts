import type { JWTPayload } from 'jose';

export interface JwtPayload extends JWTPayload {
  sub: string;
  email: string;
  role: string;
}