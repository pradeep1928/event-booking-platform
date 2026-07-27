import { SignJWT, jwtVerify, errors } from "jose";
import crypto from "node:crypto";

import { authConfig } from "../../config/auth.config.js";
// import type { AccessTokenPayload, RefreshTokenPayload  } from './jwt.types.js';
import type {
  AccessTokenPayload,
  RefreshTokenPayload,
} from "./jwt.validation.js";
import { UnauthorizedException } from "../../common/exceptions/UnauthorizedException.js";

const encoder = new TextEncoder();

export class JwtService {
  async generateAccessToken(payload: AccessTokenPayload): Promise<string> {
    return await new SignJWT(payload)
      .setProtectedHeader({
        alg: "HS256",
      })
      .setSubject(payload.sub)
      .setIssuedAt()
      .setExpirationTime(authConfig.accessToken.expiresIn)
      .sign(encoder.encode(authConfig.accessToken.secret));
  }

  async generateRefreshToken(payload: RefreshTokenPayload): Promise<string> {
    return await new SignJWT(payload)
      .setProtectedHeader({
        alg: "HS256",
      })
      .setSubject(payload.sub)
      .setIssuedAt()
      .setExpirationTime(authConfig.refreshToken.expiresIn)
      .sign(encoder.encode(authConfig.refreshToken.secret));
  }

  async verifyAccessToken(token: string): Promise<AccessTokenPayload> {
    try {
      const { payload } = await jwtVerify(
        token,
        encoder.encode(authConfig.accessToken.secret),
      );

      return payload as AccessTokenPayload;
    } catch (error) {
      if (error instanceof errors.JWTExpired) {
        throw new UnauthorizedException("Access token expired");
      }

      if (error instanceof errors.JOSEError) {
        throw new UnauthorizedException("Invalid access token");
      }
      throw error;
    }
  }

  async verifyRefreshToken(token: string): Promise<RefreshTokenPayload> {
    try {
      const { payload } = await jwtVerify(
        token,
        encoder.encode(authConfig.refreshToken.secret),
      );

      return payload as RefreshTokenPayload;
    } catch (error) {
      if (error instanceof errors.JWTExpired) {
        throw new UnauthorizedException("Refresh token expired");
      }

      if (error instanceof errors.JOSEError) {
        throw new UnauthorizedException("Invalid refresh token");
      }

      throw error;
    }
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
