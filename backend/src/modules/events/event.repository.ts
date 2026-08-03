import { EventStatus, Prisma } from "@prisma/client";
import { prisma } from "../../common/prisma/prisma.js";

export class EventRepository {
  // create event
  async create(data: Prisma.EventCreateInput) {
    return prisma.event.create({
      data,
    });
  }

  // Find all events
  async findAll(
    where: Prisma.EventWhereInput,
    orderBy: Prisma.EventOrderByWithRelationInput,
    skip: number,
    take: number,
  ) {
    const [items, total] = await prisma.$transaction([
      prisma.event.findMany({
        where,
        orderBy,
        skip,
        take,

        include: {
          organizer: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      }),

      prisma.event.count({
        where,
      }),
    ]);

    return {
      items,
      total,
    };
  }

  // find by organizer
  async findByOrganizer(
    organizerId: string,
    where: Prisma.EventWhereInput,
    orderBy: Prisma.EventOrderByWithRelationInput,
    skip: number,
    take: number,
  ) {
    const filters: Prisma.EventWhereInput = {
      ...where,
      organizerId,
    };

    const [items, total] = await prisma.$transaction([
      prisma.event.findMany({
        where: filters,
        orderBy,
        skip,
        take,

        include: {
          organizer: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      }),

      prisma.event.count({
        where: filters,
      }),
    ]);

    return {
      items,
      total,
    };
  }

  // Get event by id
  async findById(id: string) {
    return prisma.event.findUnique({
      where: {
        id,
      },

      include: {
        organizer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });
  }

  // update event
  async update(id: string, data: Prisma.EventUpdateInput) {
    return prisma.event.update({
      where: {
        id,
      },
      data,
    });
  }

  // publish event
  async publish(id: string) {
    return prisma.event.update({
      where: { id },
      data: {
        status: EventStatus.PUBLISHED,
      },
    });
  }

  // cancel event
  async cancel(id: string) {
    return prisma.event.update({
      where: {
        id,
      },
      data: {
        status: EventStatus.CANCELLED,
      },
    });
  }

  // update status of event
  async updateStatus(id: string, status: EventStatus) {
    return prisma.event.update({
      where: { id },
      data: { status },
    });
  }
}
