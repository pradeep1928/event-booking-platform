import { z } from "zod";

export const createBookingBodySchema = z.object({
  eventId: z.cuid2(),

  ticketCount: z.number().int().min(1, "Ticket count must be at least 1"),
});

export const bookingIdParamSchema = z.object({
  id: z.cuid2(),
});

export type BookingIdParamDto = z.infer<typeof bookingIdParamSchema>;
export type CreateBookingBodyDto = z.infer<typeof createBookingBodySchema>;
