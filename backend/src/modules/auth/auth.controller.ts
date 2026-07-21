import type { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service.js';
import { registerSchema } from './auth.validation.js';

export class AuthController {
  constructor(private readonly service = new AuthService()) {}

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

 // with asyncHandler
  register = async (
  req: Request,
  res: Response,
): Promise<void> => {

  const payload = registerSchema.parse(req.body);

  const user = await this.service.register(payload);

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


}