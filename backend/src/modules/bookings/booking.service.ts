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
import { BookingStatus, Role, Prisma } from "@prisma/client";
import {
  buildPagination,
  buildPaginationMeta,
} from "../../common/pagination/pagination.util.js";

import {
  calculateTotalAmount,
  isFreeAmount,
} from "../../common/utils/money.util.js";

import { BOOKING_RESERVATION_MINUTES } from "./booking.constants.js";
import { ConflictException } from "../../common/exceptions/ConflictException.js";

// payment
import { PaymentService } from "../payments/payment.service.js";
import { logger } from "../../common/logger/logger.js";

export class BookingService {
  constructor(
    private readonly repository = new BookingRepository(),
    private readonly eventRepository = new EventRepository(),
    private readonly paymentService = new PaymentService(),
  ) {}

  // create booking old
  // async create(currentUser: AuthenticatedUser, body: CreateBookingBodyDto) {
  //   const event = await this.eventRepository.findById(body.eventId);

  //   ensureEventExists(event);

  //   ensureEventBookable(event);

  //   ensureBookingOpen(event);

  //   ensureSeatsAvailable(event, body.ticketCount);

  //   const existingBooking = await this.repository.findByUserAndEvent(
  //     currentUser.id,
  //     body.eventId,
  //   );

  //   ensureCanBook(existingBooking);

  //   if (existingBooking?.status === BookingStatus.CANCELLED) {
  //     return this.repository.rebook(
  //       existingBooking.id,
  //       body.ticketCount,
  //       body.eventId,
  //     );
  //   }

  //   return this.repository.create(
  //     {
  //       ticketCount: body.ticketCount,

  //       user: {
  //         connect: {
  //           id: currentUser.id,
  //         },
  //       },

  //       event: {
  //         connect: {
  //           id: body.eventId,
  //         },
  //       },
  //     },
  //     body.eventId,
  //     body.ticketCount,
  //   );
  // }

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

    const unitPrice = new Prisma.Decimal(event.price);

    const totalAmount = calculateTotalAmount(unitPrice, body.ticketCount);

    const isFreeEvent = isFreeAmount(unitPrice);

    if (existingBooking) {
      return this.handleExistingBooking(
        currentUser,
        existingBooking,
        event.id,
        body.ticketCount,
        unitPrice,
        totalAmount,
        isFreeEvent,
      );
    }

    if (isFreeEvent) {
      return this.createFreeBooking(
        currentUser,
        event.id,
        body.ticketCount,
        unitPrice,
        totalAmount,
      );
    }

    return this.createPaidBookingReservation(
      currentUser,
      event.id,
      body.ticketCount,
      unitPrice,
      totalAmount,
    );
  }

  // method to create booking for free event
  private async createFreeBooking(
    currentUser: AuthenticatedUser,
    eventId: string,
    ticketCount: number,
    unitPrice: Prisma.Decimal,
    totalAmount: Prisma.Decimal,
  ) {
    const booking = await this.repository.createFreeBooking(
      {
        ticketCount,

        unitPrice,
        totalAmount,

        status: BookingStatus.CONFIRMED,

        confirmedAt: new Date(),

        user: {
          connect: {
            id: currentUser.id,
          },
        },

        event: {
          connect: {
            id: eventId,
          },
        },
      },
      eventId,
      ticketCount,
    );

    return {
      type: "FREE" as const,
      booking,
      paymentRequired: false,
    };
  }

  // method to create booking for paid event
  private async createPaidBookingReservation(
    currentUser: AuthenticatedUser,
    eventId: string,
    ticketCount: number,
    unitPrice: Prisma.Decimal,
    totalAmount: Prisma.Decimal,
  ) {
    const reservationExpiresAt = new Date(
      Date.now() + BOOKING_RESERVATION_MINUTES * 60 * 1000,
    );

    const booking = await this.repository.createPendingBooking(
      {
        ticketCount,
        unitPrice,
        totalAmount,
        status: BookingStatus.PENDING,
        reservationExpiresAt,
        user: {
          connect: {
            id: currentUser.id,
          },
        },

        event: {
          connect: {
            id: eventId,
          },
        },
      },
      eventId,
      ticketCount,
    );

    try {
      const payment = await this.paymentService.initialize({
        bookingId: booking.id,
        userId: currentUser.id,
        eventId,
        totalAmount,
      });

      return {
        type: "PAID" as const,
        booking,
        paymentRequired: true,
        payment,
      };
    } catch (error) {
      try {
        await this.repository.expirePendingReservation(booking.id);
      } catch (cleanupError) {
        logger.error(
          {
            bookingId: booking.id,
            error: cleanupError,
          },
          "Failed to release booking reservation after payment initialization failure",
        );
      }

      throw error;
    }
  }

  // handle existing booking
  private async handleExistingBooking(
    currentUser: AuthenticatedUser,
    existingBooking: {
      id: string;
      status: BookingStatus;
    },
    eventId: string,
    ticketCount: number,
    unitPrice: Prisma.Decimal,
    totalAmount: Prisma.Decimal,
    isFreeEvent: boolean,
  ) {
    if (
      existingBooking.status !== BookingStatus.CANCELLED &&
      existingBooking.status !== BookingStatus.EXPIRED
    ) {
      throw new ConflictException("Booking already exists for this event");
    }

    if (isFreeEvent) {
      const booking = await this.repository.reactivateBooking(
        existingBooking.id,
        eventId,
        ticketCount,
        {
          ticketCount,

          unitPrice,
          totalAmount,

          status: BookingStatus.CONFIRMED,

          confirmedAt: new Date(),

          cancelledAt: null,
          expiredAt: null,

          reservationExpiresAt: null,
        },
      );

      return {
        type: "FREE" as const,
        booking,
        paymentRequired: false,
      };
    }

    const reservationExpiresAt = new Date(
      Date.now() + BOOKING_RESERVATION_MINUTES * 60 * 1000,
    );

    const booking = await this.repository.reactivateBooking(
      existingBooking.id,
      eventId,
      ticketCount,
      {
        ticketCount,

        unitPrice,
        totalAmount,

        status: BookingStatus.PENDING,

        confirmedAt: null,
        cancelledAt: null,
        expiredAt: null,

        reservationExpiresAt,
      },
    );

    try {
      const payment = await this.paymentService.initialize({
        bookingId: booking.id,
        userId: currentUser.id,
        eventId,
        totalAmount,
      });

      return {
        type: "PAID" as const,
        booking,
        paymentRequired: true,
        payment,
      };
    } catch (error) {
      try {
        await this.repository.expirePendingReservation(booking.id);
      } catch (cleanupError) {
        logger.error(
          {
            bookingId: booking.id,
            error: cleanupError,
          },
          "Failed to release booking reservation after payment initialization failure",
        );
      }

      throw error;
    }
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
