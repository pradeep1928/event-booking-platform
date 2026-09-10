import type { AuthenticatedUser } from "../../common/types/authenticated-user.js";

import { BookingRepository } from "./booking.repository.js";

import {
  CreateBookingBodyDto,
  GetEventBookingsQueryDto,
  GetMyBookingsQueryDto,
} from "./booking.validation.js";

import {
  ensureBookingOpen,
  ensureEventNotStarted,
} from "./rules/booking-date.rule.js";

import {
  ensureSeatsAvailable,
  ensureCanBook,
} from "./rules/booking-seat.rule.js";

import {
  ensureBookingConfirmed,
  ensureEventBookable,
} from "./rules/booking-status.rule.js";

import { EventRepository } from "../events/event.repository.js";

import {
  ensureEventExists,
  ensureEventOwner,
} from "../events/rules/event-access.rule.js";
import { NotFoundException } from "../../common/exceptions/NotFoundException.js";
import { ForbiddenException } from "../../common/exceptions/ForbiddenException.js";
import { BookingStatus, Role } from "@prisma/client";
import {
  buildPagination,
  buildPaginationMeta,
} from "../../common/pagination/pagination.util.js";

export class BookingService {
  constructor(
    private readonly repository = new BookingRepository(),
    private readonly eventRepository = new EventRepository(),
  ) {}

  async create(currentUser: AuthenticatedUser, body: CreateBookingBodyDto) {
    const event = await this.eventRepository.findById(body.eventId);

    ensureEventExists(event);

    ensureEventBookable(event);

    ensureBookingOpen(event);

    ensureSeatsAvailable(event, body.ticketCount);

    const existingBooking = await this.repository.findByUserAndEvent(
      currentUser.id,
      body.eventId,
    );

    ensureCanBook(existingBooking);

    if (existingBooking?.status === BookingStatus.CANCELLED) {
      return this.repository.rebook(
        existingBooking.id,
        body.ticketCount,
        body.eventId,
      );
    }

    return this.repository.create(
      {
        ticketCount: body.ticketCount,

        user: {
          connect: {
            id: currentUser.id,
          },
        },

        event: {
          connect: {
            id: body.eventId,
          },
        },
      },
      body.eventId,
      body.ticketCount,
    );
  }

  // get booking by id (booking id)
  async findById(currentUser: AuthenticatedUser, bookingId: string) {
    const booking = await this.repository.findById(bookingId);

    if (!booking) {
      throw new NotFoundException("Booking not found");
    }

    if (booking.userId !== currentUser.id && currentUser.role !== Role.ADMIN) {
      throw new ForbiddenException(
        "You are not allowed to access this booking",
      );
    }

    return booking;
  }

  // get own bookings by userid
  async findMyBookings(
    currentUser: AuthenticatedUser,
    query: GetMyBookingsQueryDto,
  ) {
    const { skip, take } = buildPagination(query.page, query.limit);

    const { items, total } = await this.repository.findByUser(
      currentUser.id,
      skip,
      take,
    );

    return {
      items,
      pagination: buildPaginationMeta(query.page, query.limit, total),
    };
  }

  // cancel own booking
  async cancel(currentUser: AuthenticatedUser, bookingId: string) {
    const booking = await this.repository.findById(bookingId);

    if (!booking) {
      throw new NotFoundException("Booking not found");
    }

    if (booking.userId !== currentUser.id) {
      throw new ForbiddenException(
        "You are not allowed to cancel this booking",
      );
    }

    ensureBookingConfirmed(booking);

    ensureEventNotStarted(booking.event);

    return this.repository.cancel(bookingId);
  }

  // Get all bookings of event (for organizer and admin)
  async findByEvent(
    currentUser: AuthenticatedUser,
    eventId: string,
    query: GetEventBookingsQueryDto,
  ) {
    const event = await this.eventRepository.findById(eventId);

    ensureEventExists(event);

    ensureEventOwner(currentUser, event);

    const { skip, take } = buildPagination(query.page, query.limit);

    const { items, total } = await this.repository.findByEvent(
      eventId,
      query.status,
      skip,
      take,
    );

    return {
      items,
      pagination: buildPaginationMeta(query.page, query.limit, total),
    };
  }

  // get booking statistics for an event (for organizer and admin)
  async getEventStats(currentUser: AuthenticatedUser, eventId: string) {
    const event = await this.eventRepository.findById(eventId);

    ensureEventExists(event);

    ensureEventOwner(currentUser, event);

    const stats = await this.repository.getEventStats(eventId);

    return {
      eventId: event.id,
      eventName: event.title,
      ...stats,
      totalTickets: stats.confirmedTickets + stats.cancelledTickets,
      availableSeats: event.availableSeats,
    };
  }
}
