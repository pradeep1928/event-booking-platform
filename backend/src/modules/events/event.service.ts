import { EventStatus } from "@prisma/client";

import type { AuthenticatedUser } from "../../common/types/authenticated-user.js";

import { EventRepository } from "./event.repository.js";

import type { CreateEventDto } from "./event.validation.js";

import { ensureOrganizerOrAdmin } from "./rules/event-permission.rule.js";
import { validateEventDates } from "./rules/event-date.rule.js";
import { validatePrice } from "./rules/event-price.rule.js";
import { validateSeats } from "./rules/event-seat.rule.js";

export class EventService {
  constructor(private readonly repository = new EventRepository()) {}

  async create(currentUser: AuthenticatedUser, data: CreateEventDto) {
    ensureOrganizerOrAdmin(currentUser);

    validateEventDates(data);

    validateSeats(data.totalSeats);

    validatePrice(data.price);

    return this.repository.create({
      title: data.title,
      description: data.description,
      category: data.category,

      venue: data.venue,

      city: data.city,
      state: data.state,
      country: data.country,

      eventDate: data.eventDate,
      bookingStart: data.bookingStart,
      bookingEnd: data.bookingEnd,

      totalSeats: data.totalSeats,
      availableSeats: data.totalSeats,

      price: data.price,

      status: EventStatus.DRAFT,

      organizer: {
        connect: {
          id: currentUser.id,
        },
      },
    });
  }
}
