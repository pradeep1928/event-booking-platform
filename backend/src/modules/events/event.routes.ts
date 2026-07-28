import { Router } from 'express';
import { Role } from '@prisma/client';

import { authenticate } from "../../common/middlware/auth.middleware.js";

import { authorize } from "../../common/middlware/authorize.js";

import { asyncHandler } from "../../common/utils/async-handler.js";

import { EventController } from './event.controller.js';

const router = Router();

const controller =
  new EventController();

// create new event
router.post(
  '/',
  authenticate,
  authorize(
    Role.ADMIN,
    Role.ORGANIZER,
  ),
  asyncHandler(
    controller.create,
  ),
);

// get all events
router.get(
  '/',
  asyncHandler(
    controller.findAll,
  ),
);
export default router;