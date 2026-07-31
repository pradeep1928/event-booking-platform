import { EventCategory } from "@prisma/client";
import { z } from "zod";

export const createEventSchema = z.object({
  title: z.string().trim().min(3).max(150),

  description: z.string().trim().max(2000).optional(),

  category: z.nativeEnum(EventCategory),

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

export const updateEventBodySchema = createEventSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required",
  });

export type UpdateEventBodyDto = z.infer<typeof updateEventBodySchema>;
export type EventIdParamDto = z.infer<typeof eventIdParamSchema>;
export type CreateEventDto = z.infer<typeof createEventSchema>;
