import { Prisma } from "@prisma/client";
import { prisma } from "../../common/prisma/prisma.js";

export class EventRepository {
  async create(data: Prisma.EventCreateInput) {
    return prisma.event.create({
      data,
    });
  }
}
