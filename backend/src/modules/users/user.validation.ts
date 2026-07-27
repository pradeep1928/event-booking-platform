import { z } from "zod";
import { Role } from "@prisma/client";

export const getUsersSchema = z.object({
  page: z.coerce.number().min(1).default(1),

  limit: z.coerce.number().min(1).max(100).default(10),

  search: z.string().trim().optional(),

  role: z.enum(Role).optional(),

  verified: z
    .enum(["true", "false"])
    .transform((v) => v === "true")
    .optional(),
});

export type GetUsersDto = z.infer<typeof getUsersSchema>;
