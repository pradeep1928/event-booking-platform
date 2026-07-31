import { EventCategory } from "@prisma/client";
import { z } from "zod";

export const createEventSchema = z.object({
  title: z.string().trim().min(3).max(150),

  description: z.string().trim().max(2000).optional(),

  category: z.enum(EventCategory),

  venue: z.string().trim().min(3).max(200),

  city: z.string().trim().min(2).max(100),

  state: z.string().trim().min(2).max(100),

  country: z.string().trim().min(2).max(100),

  eventDate: z.coerce.date(),

  bookingStart: z.coerce.date(),

  bookingEnd: z.coerce.date(),

  totalSeats: z.number().int().positive(),

  price: z.number().min(0),
});

export const eventIdParamSchema = z.object({
  id: z.cuid2(),
});

export const updateEventBodySchema = z
  .object({
    title: z.string().trim().min(3).max(200).optional(),

    description: z.string().trim().optional(),

    category: z.enum(EventCategory).optional(),

    venue: z.string().trim().optional(),

    city: z.string().trim().optional(),

    state: z.string().trim().optional(),

    country: z.string().trim().optional(),

    eventDate: z.coerce.date().optional(),

    bookingStart: z.coerce.date().optional(),

    bookingEnd: z.coerce.date().optional(),

    totalSeats: z.number().int().positive().optional(),

    price: z.number().nonnegative().optional(),

    bannerImage: z.url().optional(),
  })
  .refine(
    (data) => Object.keys(data).length > 0,
    {
      message: "At least one field is required",
    },
  );

export type UpdateEventBodyDto = z.infer<typeof updateEventBodySchema>;
export type EventIdParamDto = z.infer<typeof eventIdParamSchema>;
export type CreateEventDto = z.infer<typeof createEventSchema>;
