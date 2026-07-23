import type { Request, Response, NextFunction } from "express";

import { AuthService } from "./auth.service.js";
import {
  changePasswordSchema,
  forgotPasswordSchema,
  loginSchema,
  refreshTokenSchema,
  registerSchema,
  resetPasswordSchema,
  verifyEmailSchema,
} from "./auth.validation.js";
import { successResponse } from "../../common/utils/api-response.js";
import { UnauthorizedException } from "../../common/exceptions/UnauthorizedException.js";
import {
  setRefreshTokenCookie,
  clearRefreshTokenCookie,
} from "../../common/utils/cookie.js";

export class AuthController {
  constructor(private readonly authService = new AuthService()) {}

  // old without asyncHandler old
  //   register = async (
  //     req: Request,
  //     res: Response,
  //     next: NextFunction,
  //   ): Promise<void> => {
  //     try {
  //       const payload = registerSchema.parse(req.body);

  //       const user = await this.service.register(payload);

  //       res.status(201).json({
  //         success: true,
  //         data: {
  //           id: user.id,
  //           email: user.email,
  //           firstName: user.firstName,
  //           lastName: user.lastName,
  //         },
  //       });
  //     } catch (error) {
  //       next(error);
  //     }
  //   };

  // with asyncHandler register user
  register = async (req: Request, res: Response): Promise<void> => {
    const payload = registerSchema.parse(req.body);

    const user = await this.authService.register(payload);

    // res.status(201).json({
    //   success: true,
    //   data: {
    //     id: user.id,
    //     email: user.email,
    //     firstName: user.firstName,
    //     lastName: user.lastName,
    //     role: user.role,
    //   },
    // });

    successResponse(
      res,
      {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      "User registered successfully",
      201,
    );
  };

  // Login user
  login = async (req: Request, res: Response): Promise<void> => {
    const payload = loginSchema.parse(req.body);

    const result = await this.authService.login(payload);

    setRefreshTokenCookie(res, result.refreshToken);

    successResponse(
      res,
      {
        accessToken: result.accessToken,
        user: result.user,
      },
      "Login successful",
    );
  };

  // Test token
  me = async (req: Request, res: Response): Promise<void> => {
    successResponse(res, req.user);
  };

  // refresh token
  refreshToken = async (req: Request, res: Response): Promise<void> => {
    const payload = refreshTokenSchema.parse({
      refreshToken: req.cookies.refreshToken,
    });

    const result = await this.authService.refreshToken(payload);
    setRefreshTokenCookie(res, result.refreshToken);

    successResponse(
      res,
      {
        accessToken: result.accessToken,
      },
      "Token refreshed",
    );
  };

  // logout user
  logout = async (req: Request, res: Response): Promise<void> => {
    const { refreshToken } = refreshTokenSchema.parse({
      refreshToken: req.cookies.refreshToken,
    });

    await this.authService.logout(refreshToken);
    clearRefreshTokenCookie(res);

    successResponse(res, null, "Logged out successfully");
  };

  // logout user all
  logoutAll = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new UnauthorizedException();
    }
    await this.authService.logoutAll(req.user?.id);
    clearRefreshTokenCookie(res);

    successResponse(res, null, "Logged out from all devices");
  };

  // change password
  changePassword = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new UnauthorizedException();
    }

    const payload = changePasswordSchema.parse(req.body);
    await this.authService.changePassword(req.user.id, payload);

    // Remove refresh token cookie from current browser
    clearRefreshTokenCookie(res);
    successResponse(res, null, "Password changed successfully");
  };

  // forgot password
  forgotPassword = async (req: Request, res: Response): Promise<void> => {
    const payload = forgotPasswordSchema.parse(req.body);

    await this.authService.forgotPassword(payload);

    successResponse(
      res,
      null,
      "If an account exists, a password reset link has been sent.",
    );
  };

  // reset password
  resetPassword = async (req: Request, res: Response): Promise<void> => {
    const payload = resetPasswordSchema.parse(req.body);

    await this.authService.resetPassword(payload);

    successResponse(res, null, "Password reset successfully");
  };

  verifyEmail = async (req: Request, res: Response): Promise<void> => {
    const payload = verifyEmailSchema.parse(req.body);

    await this.authService.verifyEmail(payload);

    successResponse(res, null, "Email verified successfully");
  };
}
