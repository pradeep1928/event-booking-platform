import { SignJWT, jwtVerify } from 'jose';

import { authConfig } from '../../config/auth.config.js';
import type { JwtPayload } from './jwt.types.js';

const encoder = new TextEncoder();

export class JwtService {
  async generateAccessToken(
    payload: JwtPayload,
  ): Promise<string> {
    return await new SignJWT(payload)
      .setProtectedHeader({
        alg: 'HS256',
      })
      .setSubject(payload.sub)
      .setIssuedAt()
      .setExpirationTime(
        authConfig.accessToken.expiresIn,
      )
      .sign(
        encoder.encode(
          authConfig.accessToken.secret,
        ),
      );
  }

  async generateRefreshToken(
    payload: JwtPayload,
  ): Promise<string> {
    return await new SignJWT(payload)
      .setProtectedHeader({
        alg: 'HS256',
      })
      .setSubject(payload.sub)
      .setIssuedAt()
      .setExpirationTime(
        authConfig.refreshToken.expiresIn,
      )
      .sign(
        encoder.encode(
          authConfig.refreshToken.secret,
        ),
      );
  }

  async verifyAccessToken(
    token: string,
  ): Promise<JwtPayload> {
    const { payload } = await jwtVerify(
      token,
      encoder.encode(
        authConfig.accessToken.secret,
      ),
    );

    return payload as JwtPayload;
  }

  async verifyRefreshToken(
    token: string,
  ): Promise<JwtPayload> {
    const { payload } = await jwtVerify(
      token,
      encoder.encode(
        authConfig.refreshToken.secret,
      ),
    );

    return payload as JwtPayload;
  }
}

export const jwtService = new JwtService();