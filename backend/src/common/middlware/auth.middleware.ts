import type { NextFunction, Request, Response } from 'express';

import { jwtService } from '../../infrastructure/jwt/jwt.service.js';

import { UnauthorizedException } from '../exceptions/UnauthorizedException.js';

export async function authenticate(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return next(
      new UnauthorizedException('Authentication required'),
    );
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload =
      await jwtService.verifyAccessToken(token);

    req.user = {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    };

    next();
  } catch {
    next(
      new UnauthorizedException('Invalid or expired token'),
    );
  }
}