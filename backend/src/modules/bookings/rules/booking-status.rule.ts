
import {
  Booking,
  BookingStatus,
  Event,
  EventStatus,
} from "@prisma/client";

import { BadRequestException } from "../../../common/exceptions/BadRequestException.js";

export function ensureEventBookable(
  event: Event,
): void {
  if (event.status !== EventStatus.PUBLISHED) {
    throw new BadRequestException(
      "Only published events can be booked",
    );
  }
}

export function ensureBookingConfirmed(
  booking: Booking,
): void {
  if (
    booking.status !==
    BookingStatus.CONFIRMED
  ) {
    throw new BadRequestException(
      "Only confirmed bookings can be cancelled",
    );
  }
}