import { Router } from "express";

import { authenticate } from "../../common/middlware/auth.middleware.js";

import { authorize } from "../../common/middlware/authorize.js";

import { asyncHandler } from "../../common/utils/async-handler.js";

import { UserController } from "./user.controller.js";

import { Role } from "@prisma/client";

const router = Router();

const controller = new UserController();

// Get all users
router.get(
  "/",
  authenticate,
  authorize(Role.ADMIN),
  asyncHandler(controller.getAll),
);

// Get user by id
router.get(
  "/:id",
  authenticate,
  authorize(Role.ADMIN),
  asyncHandler(controller.getById),
);

// update role - user -> org, org -> user
router.patch(
  "/:id/role",
  authenticate,
  authorize(Role.ADMIN),
  asyncHandler(controller.updateRole),
);

// update user status - active or inactive
router.patch(
  "/:id/status",
  authenticate,
  authorize(Role.ADMIN),
  asyncHandler(controller.updateStatus),
);
export default router;
