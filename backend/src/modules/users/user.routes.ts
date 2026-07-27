import { Router } from "express";

import { authenticate } from "../../common/middlware/auth.middleware.js";

import { authorize } from "../../common/middlware/authorize.js";

import { asyncHandler } from "../../common/utils/async-handler.js";

import { UserController } from "./user.controller.js";

import { Role } from "@prisma/client";

const router = Router();

const controller = new UserController();

router.get(
  "/",
  authenticate,
  authorize(Role.ADMIN),
  asyncHandler(controller.getAll),
);

export default router;
