import type {
  Request,
  Response,
  NextFunction,
} from 'express';
import { Role } from '@prisma/client';

import { ForbiddenException } from '../exceptions/ForbiddenException.js';
import { UnauthorizedException } from '../exceptions/UnauthorizedException.js';

export function authorize(
  ...roles: Role[]
) {
  return (
    req: Request,
    _res: Response,
    next: NextFunction,
  ) => {

    if (!req.user) {
      return next(
        new UnauthorizedException(
          'Authentication required',
        ),
      );
    }

    if (
      !roles.includes(req.user.role)
    ) {
      return next(
        new ForbiddenException(
          'You are not authorized to access this resource.',
        ),
      );
    }

    next();
  };
}