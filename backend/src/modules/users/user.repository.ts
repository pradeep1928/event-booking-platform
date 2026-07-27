import { Prisma, Role } from "@prisma/client";
import { prisma } from "../../common/prisma/prisma.js";
import { GetUsersDto } from "./user.validation.js";

export class UserRepository {
  // Get all users
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

  // Get user by id
  async findById(id: string) {
    return prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        isVerified: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  // update role - user -> org, org -> user
  async updateRole(id: string, role: Role) {
    return prisma.user.update({
      where: {
        id,
      },
      data: {
        role,
      },
      select: {
        id: true,
        role: true,
      },
    });
  }

  // update user status - active or inactive
  async updateStatus(id: string, isActive: boolean) {
    return prisma.user.update({
      where: {
        id,
      },
      data: {
        isActive,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        isActive: true,
      },
    });
  }

  // prisma transaction for update user status - active or inactive
  async updateStatusTransaction(id: string, isActive: boolean) {
    return prisma.$transaction(async (tx) => {
      const user = await tx.user.update({
        where: {
          id,
        },
        data: {
          isActive,
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          role: true,
          isActive: true,
        },
      });

      if (!isActive) {
        await tx.refreshToken.deleteMany({
          where: {
            userId: id,
          },
        });
      }

      return user;
    });
  }
}
