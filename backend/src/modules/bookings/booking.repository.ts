
import { Prisma } from "@prisma/client"
import { prisma } from "../../common/prisma/prisma.js";
import { BadRequestException } from "../../common/exceptions/BadRequestException.js";


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
    const updatedEvent =
      await tx.event.updateMany({
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
      throw new BadRequestException(
        "Not enough seats available",
      );
    }

    const booking =
      await tx.booking.create({
        data,
        include: {
          event: true,
        },
      });

    return booking;
  });
}
}
