import { z } from "zod";

export const createBookingBodySchema = z.object({
  eventId: z.cuid2(),

  ticketCount: z.number().int().min(1, "Ticket count must be at least 1"),
});

export const bookingIdParamSchema = z.object({
  id: z.cuid2(),
});

export const getMyBookingsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),

  limit: z.coerce.number().int().min(1).max(100).default(10),
});

export type GetMyBookingsQueryDto = z.infer<typeof getMyBookingsQuerySchema>;
export type BookingIdParamDto = z.infer<typeof bookingIdParamSchema>;
export type CreateBookingBodyDto = z.infer<typeof createBookingBodySchema>;
