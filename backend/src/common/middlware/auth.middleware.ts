import type { NextFunction, Request, Response } from "express";

import { jwtService } from "../../infrastructure/jwt/jwt.service.js";
import { UnauthorizedException } from "../exceptions/UnauthorizedException.js";
import { AuthService } from "../../modules/auth/auth.service.js";

const authService = new AuthService();

export async function authenticate(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return next(new UnauthorizedException("Authentication required"));
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = await jwtService.verifyAccessToken(token);

    const user = await authService.validateAuthenticatedUser(payload.sub);

    req.user = user


    next();
  } catch (error){
    next(error);
  }
}
