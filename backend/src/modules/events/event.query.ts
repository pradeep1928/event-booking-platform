import { EventCategory, EventStatus } from "@prisma/client";

import { z } from "zod";

import { paginationSchema } from "../../common/pagination/pagination.validation.js";

export const publicEventsQuerySchema = paginationSchema.extend({
  search: z.string().trim().optional(),

  city: z.string().trim().optional(),

  category: z.enum(EventCategory).optional(),

  organizerId: z.cuid2().optional(),

  sortBy: z.enum(["eventDate", "price", "createdAt"]).default("eventDate"),

  sortOrder: z.enum(["asc", "desc"]).default("asc"),
});

export const organizerEventsQuerySchema = paginationSchema.extend({
  search: z.string().trim().optional(),

  city: z.string().trim().optional(),

  category: z.enum(EventCategory).optional(),

  status: z.enum(EventStatus).optional(),

  sortBy: z.enum(["eventDate", "price", "createdAt"]).default("createdAt"),

  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type OrganizerEventsQueryDto = z.infer<typeof organizerEventsQuerySchema>;
export type PublicEventsQueryDto = z.infer<typeof publicEventsQuerySchema>;
