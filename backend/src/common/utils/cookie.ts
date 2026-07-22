import { Response } from 'express';
import { authConfig } from '../../config/auth.config.js';

export function setRefreshTokenCookie(
  res: Response,
  refreshToken: string,
) {
  res.cookie(
    'refreshToken',
    refreshToken,
    {
      httpOnly: true,
      secure:
        process.env.NODE_ENV === 'production',

      sameSite: 'strict',

      path: '/api/v1/auth',

      maxAge:
        Number(authConfig.refreshToken.cookieMaxAge),
    },
  );
}

export function clearRefreshTokenCookie(
  res: Response,
) {
  res.clearCookie(
    'refreshToken',
    {
      httpOnly: true,
      secure:
        process.env.NODE_ENV === 'production',

      sameSite: 'strict',

      path: '/api/v1/auth',
    },
  );
}