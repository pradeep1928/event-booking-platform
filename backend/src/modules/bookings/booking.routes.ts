import { Router } from "express";

import { BookingController } from "./booking.controller.js";

import { authenticate } from "../../common/middlware/auth.middleware.js";

import { asyncHandler } from "../../common/utils/async-handler.js";
import { authorize } from "../../common/middlware/authorize.js";
import { Role } from "@prisma/client";

const router = Router();

const controller = new BookingController();

// create bookings
router.post("/", authenticate, asyncHandler(controller.create));

// get own booking by userid
router.get("/", authenticate, asyncHandler(controller.findMyBookings));

// Get all bookings of event (for organizer and admin)
router.get(
  "/event/:eventId",
  authenticate,
  authorize(Role.ADMIN, Role.ORGANIZER),
  asyncHandler(controller.findByEvent),
);

// Get booking by id (booking id)
router.get("/:id", authenticate, asyncHandler(controller.findById));

// cancel own booking
router.patch("/:id/cancel", authenticate, asyncHandler(controller.cancel));

export default router;
