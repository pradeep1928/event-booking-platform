import { Prisma, Role } from "@prisma/client";
import { prisma } from "../../common/prisma/prisma.js";
import { GetUsersDto } from "./user.validation.js";

export class UserRepository {
  async findAll(query: GetUsersDto) {
    const { page, limit, search, role, verified } = query;

    const where: Prisma.UserWhereInput = {
      ...(search && {
        OR: [
          {
            firstName: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            lastName: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            email: {
              contains: search,
              mode: "insensitive",
            },
          },
        ],
      }),

      ...(role && { role }),

      ...(verified !== undefined && {
        isVerified: verified,
      }),
    };

    const [users, total] = await prisma.$transaction([
      prisma.user.findMany({
        where,

        skip: (page - 1) * limit,

        take: limit,

        orderBy: {
          createdAt: "desc",
        },

        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          role: true,
          isVerified: true,
          createdAt: true,
        },
      }),

      prisma.user.count({
        where,
      }),
    ]);

    return {
      users,
      total,
    };
  }
}
