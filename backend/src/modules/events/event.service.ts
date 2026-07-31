import { Prisma } from "@prisma/client";
import { EventStatus } from "@prisma/client";

import type { AuthenticatedUser } from "../../common/types/authenticated-user.js";

import { EventRepository } from "./event.repository.js";

import type { CreateEventDto, UpdateEventBodyDto, eventIdParamSchema } from "./event.validation.js";

import { ensureOrganizerOrAdmin } from "./rules/event-permission.rule.js";
import { validateEventDates } from "./rules/event-date.rule.js";
import { validateEventPrice } from "./rules/event-price.rule.js";
import { calculateAvailableSeats, validateNewEventSeats, validateUpdatedEventSeats } from "./rules/event-seat.rule.js";

import {
  buildPagination,
  buildPaginationMeta,
} from "../../common/pagination/pagination.util.js";

import type {
  OrganizerEventsQueryDto,
  PublicEventsQueryDto,
} from "./event.query.js";

import { NotFoundException } from "../../common/exceptions/NotFoundException.js";
import {
  ensureEventEditable,
  ensureEventExists,
  ensureEventOwner,
} from "./rules/event-access.rule.js";

export class EventService {
  constructor(private readonly repository = new EventRepository()) {}

  // create event
  async create(currentUser: AuthenticatedUser, data: CreateEventDto) {
    ensureOrganizerOrAdmin(currentUser);

    validateEventDates(data);

    validateNewEventSeats(data.totalSeats);

    validateEventPrice(data.price);

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
  async findAll(query: PublicEventsQueryDto) {
    const where: Prisma.EventWhereInput = { status: EventStatus.PUBLISHED };

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

  // // find by organizer
  async findMyEvents(
    currentUser: AuthenticatedUser,
    query: OrganizerEventsQueryDto,
  ) {
    ensureOrganizerOrAdmin(currentUser);

    const where: Prisma.EventWhereInput = {};

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

    if (query.status) {
      where.status = query.status;
    }

    if (query.category) {
      where.category = query.category;
    }

    const orderBy = {
      [query.sortBy]: query.sortOrder,
    };

    const { skip, take } = buildPagination(query.page, query.limit);

    const { items, total } = await this.repository.findByOrganizer(
      currentUser.id,
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

  // Find event by id
  async findPublicById(id: string) {
    const event = await this.repository.findById(id);

    if (!event) {
      throw new NotFoundException("Event not found");
    }

    if (event.status !== EventStatus.PUBLISHED) {
      throw new NotFoundException("Event not found");
    }

    return event;
  }

  // update event only admin (all) or organizer (own events)
  async update(
    currentUser: AuthenticatedUser,
    eventId: string,
    body: UpdateEventBodyDto,
  ) {
    const event = await this.repository.findById(eventId);

    ensureEventExists(event);

    ensureEventOwner(currentUser, event);

    ensureEventEditable(event);

    const updatedEvent = {
      ...event,
      ...body,
    };

    validateEventDates(updatedEvent);

    validateEventPrice(updatedEvent.price);

    const updateData: Prisma.EventUpdateInput = {
      ...body
    }

    if (body.totalSeats !== undefined) {
    validateUpdatedEventSeats(event, updatedEvent.totalSeats);
    updateData.availableSeats = calculateAvailableSeats(event, body.totalSeats)
    }

    return this.repository.update(eventId, updateData);
  }
}
