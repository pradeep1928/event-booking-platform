import { BadRequestException } from "../../../common/exceptions/BadRequestException.js";

import type { CreateEventDto } from "../event.validation.js";

export function validateEventDates(data: CreateEventDto): void {
  const now = new Date();

  if (data.eventDate <= now) {
    throw new BadRequestException("Event date must be in the future");
  }

  if (data.bookingStart >= data.bookingEnd) {
    throw new BadRequestException("Booking start must be before booking end");
  }

  if (data.bookingStart >= data.eventDate) {
    throw new BadRequestException("Booking start must be before event date");
  }

  if (data.bookingEnd >= data.eventDate) {
    throw new BadRequestException("Booking end must be before event date");
  }
}
