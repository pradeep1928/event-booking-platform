
import { Event } from "@prisma/client";

import { BadRequestException } from "../../../common/exceptions/BadRequestException.js";

export function ensureBookingOpen(
  event: Event,
): void {
  const now = new Date();

  if (now < event.bookingStart) {
    throw new BadRequestException(
      "Booking has not started yet",
    );
  }

  if (now > event.bookingEnd) {
    throw new BadRequestException(
      "Booking has ended",
    );
  }
}