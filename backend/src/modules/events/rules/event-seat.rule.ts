import { Event } from "@prisma/client";

import { BadRequestException } from "../../../common/exceptions/BadRequestException.js";

export function validateNewEventSeats(totalSeats: number): void {
  if (totalSeats <= 0) {
    throw new BadRequestException("Total seats must be greater than zero");
  }
}

export function validateUpdatedEventSeats(
  currentEvent: Event,
  newTotalSeats: number,
): void {
  if (newTotalSeats <= 0) {
    throw new BadRequestException("Total seats must be greater than zero");
  }

  const bookedSeats = currentEvent.totalSeats - currentEvent.availableSeats;

  if (newTotalSeats < bookedSeats) {
    throw new BadRequestException(
      "Total seats cannot be less than booked seats",
    );
  }
}


export function getBookedSeats(event: Event): number {
  return event.totalSeats - event.availableSeats;
}


export function calculateAvailableSeats(
  event: Event,
  newTotalSeats: number,
): number {
  const bookedSeats = getBookedSeats(event);
  return newTotalSeats - bookedSeats;
}
