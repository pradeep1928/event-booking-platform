import { SignJWT, jwtVerify } from 'jose';
import crypto from 'node:crypto';

import { authConfig } from '../../config/auth.config.js';
// import type { AccessTokenPayload, RefreshTokenPayload  } from './jwt.types.js';
import type {AccessTokenPayload, RefreshTokenPayload} from './jwt.validation.js'

const encoder = new TextEncoder();

export class JwtService {
  async generateAccessToken(
    payload: AccessTokenPayload ,
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
    payload: RefreshTokenPayload ,
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
  ): Promise<AccessTokenPayload > {
    const { payload } = await jwtVerify(
      token,
      encoder.encode(
        authConfig.accessToken.secret,
      ),
    );

    return payload as AccessTokenPayload ;
  }

  async verifyRefreshToken(
    token: string,
  ): Promise<RefreshTokenPayload > {
    const { payload } = await jwtVerify(
      token,
      encoder.encode(
        authConfig.refreshToken.secret,
      ),
    );

    return payload as RefreshTokenPayload ;
  }

  getRefreshTokenExpiryDate(): Date {
  const expiresAt = new Date();
  expiresAt.setDate(
    expiresAt.getDate() + 7,
  );

  return expiresAt;
}
}

export const jwtService = new JwtService();