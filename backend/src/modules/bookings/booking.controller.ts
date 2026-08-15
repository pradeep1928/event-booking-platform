import { Request, Response } from "express";

import { BookingService } from "./booking.service.js";

import {
  createBookingBodySchema,
  bookingIdParamSchema,
  getMyBookingsQuerySchema,
} from "./booking.validation.js";
import { successResponse } from "../../common/utils/api-response.js";

export class BookingController {
  constructor(private readonly service = new BookingService()) {}

  // create booking for event
  create = async (req: Request, res: Response) => {
    const body = createBookingBodySchema.parse(req.body);

    const booking = await this.service.create(req.user!, body);

    successResponse(res, booking, "Booking created successfully", 201);
  };

  // Get booking by id (booking id)
  findById = async (req: Request, res: Response) => {
    const { id } = bookingIdParamSchema.parse(req.params);

    const booking = await this.service.findById(req.user!, id);

    successResponse(res, booking, "Booking retrieved successfully");
  };

  // get own booking by userid
  findMyBookings = async (req: Request, res: Response) => {
    const query = getMyBookingsQuerySchema.parse(req.query);

    const result = await this.service.findMyBookings(req.user!, query);

    successResponse(res, result, "Bookings retrieved successfully");
  };
}
