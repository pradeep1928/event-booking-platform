import { Router } from 'express';
import { AuthController } from './auth.controller.js';
import { asyncHandler } from '../../common/utils/async-handler.js';

const router = Router();
const controller = new AuthController();

// old without asyncHandler
// router.post('/register', controller.register);

// with asyncHandler
router.post('/register', asyncHandler(controller.register));
router.post(
    '/login',
    asyncHandler(controller.login),
);

export default router;