import { BookingStatus, Prisma } from "@prisma/client";
import { prisma } from "../../common/prisma/prisma.js";
import { BadRequestException } from "../../common/exceptions/BadRequestException.js";
import { NotFoundException } from "../../common/exceptions/NotFoundException.js";

export class BookingRepository {
  async findById(id: string) {
    return prisma.booking.findUnique({
      where: {
        id,
      },
      include: {
        event: true,
        user: true,
      },
    });
  }

  async findByUserAndEvent(userId: string, eventId: string) {
    return prisma.booking.findUnique({
      where: {
        userId_eventId: {
          userId,
          eventId,
        },
      },
    });
  }

  // create booking for event
  async create(
    data: Prisma.BookingCreateInput,
    eventId: string,
    ticketCount: number,
  ) {
    return prisma.$transaction(async (tx) => {
      const updatedEvent = await tx.event.updateMany({
        where: {
          id: eventId,
          availableSeats: {
            gte: ticketCount,
          },
        },
        data: {
          availableSeats: {
            decrement: ticketCount,
          },
        },
      });

      if (updatedEvent.count === 0) {
        throw new BadRequestException("Not enough seats available");
      }

      const booking = await tx.booking.create({
        data,
        include: {
          event: true,
        },
      });

      return booking;
    });
  }

  // get own booking
  async findByUser(userId: string, skip: number, take: number) {
    const filters: Prisma.BookingWhereInput = {
      userId,
    };

    const [items, total] = await prisma.$transaction([
      prisma.booking.findMany({
        where: filters,

        orderBy: {
          createdAt: "desc",
        },

        skip,
        take,

        include: {
          event: {
            select: {
              id: true,
              title: true,
              category: true,
              venue: true,
              city: true,
              state: true,
              eventDate: true,
              status: true,
            },
          },
        },
      }),

      prisma.booking.count({
        where: filters,
      }),
    ]);

    return {
      items,
      total,
    };
  }

// cancel own booking
  async cancel(bookingId: string) {
    return prisma.$transaction(async (tx) => {
      const booking = await tx.booking.findUnique({
        where: {
          id: bookingId,
        },
        include: {
          event: true,
        },
      });

      if (!booking) {
        throw new NotFoundException("Booking not found");
      }

      const updatedBooking = await tx.booking.updateMany({
        where: {
          id: bookingId,
          status: BookingStatus.CONFIRMED,
        },
        data: {
          status: BookingStatus.CANCELLED,
        },
      });

      if (updatedBooking.count === 0) {
        throw new BadRequestException("Booking is already cancelled");
      }

      await tx.event.update({
        where: {
          id: booking.eventId,
        },
        data: {
          availableSeats: {
            increment: booking.ticketCount,
          },
        },
      });

      return tx.booking.findUnique({
        where: {
          id: bookingId,
        },
        include: {
          event: true,
        },
      });
    });
  }
}
