import { Router } from 'express';
import { AuthController } from './auth.controller.js';
import { asyncHandler } from '../../common/utils/async-handler.js';
import { authenticate } from '../../common/middlware/auth.middleware.js';

const router = Router();
const controller = new AuthController();

// old without asyncHandler
// router.post('/register', controller.register);

// with asyncHandler register user
router.post('/register', asyncHandler(controller.register));

// login user
router.post('/login', asyncHandler(controller.login));

// test token
router.get(
  '/me',
  authenticate,
  asyncHandler(controller.me),
)

// refresh token
router.post(
  '/refresh-token',
  asyncHandler(
    controller.refreshToken,
  ),
);

// logout user
router.post(
  '/logout',
  asyncHandler(controller.logout),
);

// logout user all
router.post(
    '/logout-all',
    authenticate,
    asyncHandler(controller.logoutAll),
);

// change password
router.patch(
  '/change-password',
  authenticate,
  asyncHandler(
    controller.changePassword,
  ),
);
export default router;