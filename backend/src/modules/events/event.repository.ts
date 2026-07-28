import { Prisma } from "@prisma/client";
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
}
