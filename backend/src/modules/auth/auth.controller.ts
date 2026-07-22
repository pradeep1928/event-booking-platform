import type { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service.js';
import { loginSchema, refreshTokenSchema, registerSchema } from './auth.validation.js';

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
  register = async (
  req: Request,
  res: Response,
): Promise<void> => {

  const payload = registerSchema.parse(req.body);

  const user = await this.authService.register(payload);

  res.status(201).json({
    success: true,
    data: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    }, 
  });
};

// Login user
login = async (
    req: Request,
    res: Response,
): Promise<void> => {

    const payload =
        loginSchema.parse(req.body);

    const result =
        await this.authService.login(payload);

    res.status(200).json({
        success: true,
        message: 'Login successful',
        data: result,
    });
};

// Test token 
me = async (
  req: Request,
  res: Response,
): Promise<void> => {
  res.json({
    success: true,
    data: req.user
  });
};

// refresh token
refreshToken = async (
  req: Request,
  res: Response,
): Promise<void> => {

  const payload =
    refreshTokenSchema.parse(
      req.body,
    );

  const result =
    await this.authService.refreshToken(
      payload,
    );

  res.json({
    success: true,
    message: 'Token refreshed',
    data: result,
  });
};

// logout user
logout = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { refreshToken } =
    refreshTokenSchema.parse(req.body);

  await this.authService.logout(refreshToken);

  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
};

}