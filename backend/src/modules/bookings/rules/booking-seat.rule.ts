
import { Event, Booking, BookingStatus} from "@prisma/client";

import { BadRequestException } from "../../../common/exceptions/BadRequestException.js";
import { ConflictException } from "../../../common/exceptions/ConflictException.js";

export function ensureSeatsAvailable(
  event: Event,
  ticketCount: number,
): void {
  if (
    event.availableSeats < ticketCount
  ) {
    throw new BadRequestException(
      "Not enough seats available",
    );
  }
}


export function ensureCanBook(
  booking: Booking | null,
): void {
  if (booking && booking.status === BookingStatus.CONFIRMED) {
    throw new ConflictException(
      "You have already booked this event",
    );
  }
}