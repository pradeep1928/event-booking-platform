import { Event } from "@prisma/client";

export type EventDateValidation =
    Pick<Event,
        "eventDate"
      | "bookingStart"
      | "bookingEnd">;

export type EventPriceValidation =
    Pick<Event,
        "price">;

export type EventSeatValidation =
    Pick<Event,
        "totalSeats">;