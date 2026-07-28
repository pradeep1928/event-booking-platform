import { EventCategory, EventStatus } from "@prisma/client";

import { z } from "zod";

import { paginationSchema } from "../../../common/pagination/pagination.validation.js";

export const getEventsQuerySchema = paginationSchema.extend({
  search: z.string().trim().optional(),

  city: z.string().trim().optional(),

  category: z.enum(EventCategory).optional(),

  organizerId: z.cuid2().optional(),

  sortBy: z.enum(["eventDate", "price", "createdAt"]).default("eventDate"),

  sortOrder: z.enum(["asc", "desc"]).default("asc"),
});

export type GetEventsQueryDto = z.infer<typeof getEventsQuerySchema>;
