import type { AuthenticatedUser } from "../../common/types/authenticated-user.js";

import { BookingRepository } from "./booking.repository.js";

import { CreateBookingBodyDto } from "./booking.validation.js";

import { ensureBookingOpen } from "./rules/booking-date.rule.js";

import {
  ensureSeatsAvailable,
  ensureNotAlreadyBooked,
} from "./rules/booking-seat.rule.js";

import { ensureEventBookable } from "./rules/booking-status.rule.js";

import { EventRepository } from "../events/event.repository.js";

import { ensureEventExists } from "../events/rules/event-access.rule.js";
import { NotFoundException } from "../../common/exceptions/NotFoundException.js";
import { ForbiddenException } from "../../common/exceptions/ForbiddenException.js";
import { Role } from "@prisma/client";

export class BookingService {
  constructor(
    private readonly repository = new BookingRepository(),

    private readonly eventRepository = new EventRepository(),
  ) {}

  async create(currentUser: AuthenticatedUser, body: CreateBookingBodyDto) {
    const event = await this.eventRepository.findById(body.eventId);

    ensureEventExists(event);

    ensureEventBookable(event);

    ensureBookingOpen(event);

    ensureSeatsAvailable(event, body.ticketCount);

    const existingBooking = await this.repository.findByUserAndEvent(
      currentUser.id,
      body.eventId,
    );

    ensureNotAlreadyBooked(existingBooking);

    return this.repository.create(
      {
        ticketCount: body.ticketCount,

        user: {
          connect: {
            id: currentUser.id,
          },
        },

        event: {
          connect: {
            id: body.eventId,
          },
        },
      },
      body.eventId,
      body.ticketCount,
    );
  }

  async findById(currentUser: AuthenticatedUser, bookingId: string) {
    const booking = await this.repository.findById(bookingId);

    if (!booking) {
      throw new NotFoundException("Booking not found");
    }

    if (booking.userId !== currentUser.id && currentUser.role !== Role.ADMIN) {
      throw new ForbiddenException(
        "You are not allowed to access this booking",
      );
    }

    return booking;
  }
}
