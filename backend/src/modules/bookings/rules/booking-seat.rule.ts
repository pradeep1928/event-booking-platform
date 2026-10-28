import { Event, BookingStatus, type Booking } from "@prisma/client";

import { BadRequestException } from "../../../common/exceptions/BadRequestException.js";
import { ConflictException } from "../../../common/exceptions/ConflictException.js";

export function ensureSeatsAvailable(event: Event, ticketCount: number): void {
  if (event.availableSeats < ticketCount) {
    throw new BadRequestException("Not enough seats available");
  }
}



export const ensureCanBook = (existingBooking: Booking | null) => {
  if (!existingBooking) {
    return;
  }

  if (existingBooking.status === BookingStatus.CONFIRMED) {
    throw new ConflictException(
      "You already have a confirmed booking for this event",
    );
  }

  if (existingBooking.status === BookingStatus.PENDING) {
    throw new ConflictException(
      "You already have a pending booking for this event",
    );
  }
};

// old logic without payment gateway
// export function ensureCanBook(
//   booking: Booking | null,
// ): void {
//   if (booking && booking.status === BookingStatus.CONFIRMED) {
//     throw new ConflictException(
//       "You have already booked this event",
//     );
//   }
// }
