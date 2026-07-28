import { Prisma } from "@prisma/client";
import { EventStatus } from "@prisma/client";

import type { AuthenticatedUser } from "../../common/types/authenticated-user.js";

import { EventRepository } from "./event.repository.js";

import type { CreateEventDto } from "./event.validation.js";

import { ensureOrganizerOrAdmin } from "./rules/event-permission.rule.js";
import { validateEventDates } from "./rules/event-date.rule.js";
import { validatePrice } from "./rules/event-price.rule.js";
import { validateSeats } from "./rules/event-seat.rule.js";

import {
  buildPagination,
  buildPaginationMeta,
} from "../../common/pagination/pagination.util.js";

import type { GetEventsQueryDto } from "./rules/event.query.js";

export class EventService {
  constructor(private readonly repository = new EventRepository()) {}

  // create event
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

  // Find all PUBLISHED events
  async findAll(query: GetEventsQueryDto) {
    const where: Prisma.EventWhereInput = { status: EventStatus.PUBLISHED};

    if (query.search) {
      where.OR = [
        {
          title: {
            contains: query.search,
            mode: "insensitive",
          },
        },

        {
          description: {
            contains: query.search,
            mode: "insensitive",
          },
        },

        {
          venue: {
            contains: query.search,
            mode: "insensitive",
          },
        },

        {
          city: {
            contains: query.search,
            mode: "insensitive",
          },
        },
      ];
    }

    if (query.city) {
      where.city = query.city;
    }

    if (query.category) {
      where.category = query.category;
    }

    if (query.organizerId) {
      where.organizerId = query.organizerId;
    }

    const orderBy = {
      [query.sortBy]: query.sortOrder,
    };

    const { skip, take } = buildPagination(query.page, query.limit);

    const { items, total } = await this.repository.findAll(
      where,
      orderBy,
      skip,
      take,
    );

    return {
      items,
      pagination: buildPaginationMeta(query.page, query.limit, total),
    };
  }
}
