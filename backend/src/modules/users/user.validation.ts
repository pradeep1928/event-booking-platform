import { z } from "zod";
import { Role } from "@prisma/client";

export const getUsersQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),

  limit: z.coerce.number().min(1).max(100).default(10),

  search: z.string().trim().optional(),

  role: z.enum(Role).optional(),

  verified: z
    .enum(["true", "false"])
    .transform((v) => v === "true")
    .optional(),
});

export const userIdParamsSchema = z.object({
  id: z.cuid2(),
});

export const updateUserRoleSchema = z.object({
  id: z.cuid2(), // from req.params
  role: z.enum([Role.USER, Role.ORGANIZER]), // from req.body
});


export const updateUserStatusSchema = z.object({
  id: z.cuid2(), // from req.params
  isActive: z.boolean(), // from req.body
});

export type GetUsersDto = z.infer<typeof getUsersQuerySchema>;
export type GetUserByIdDto = z.infer<typeof userIdParamsSchema>;
export type UpdateUserRoleDto = z.infer<typeof updateUserRoleSchema>;
export type UpdateUserStatusDto = z.infer<typeof updateUserStatusSchema>;
