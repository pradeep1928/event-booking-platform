import { Router } from "express";

import { BookingController } from "./booking.controller.js";

import { authenticate } from "../../common/middlware/auth.middleware.js";

import { asyncHandler } from "../../common/utils/async-handler.js";

const router = Router();

const controller = new BookingController();

router.post("/", authenticate, asyncHandler(controller.create));

router.get("/", authenticate, asyncHandler(controller.findMyBookings));

router.get("/:id", authenticate, asyncHandler(controller.findById));

export default router;
