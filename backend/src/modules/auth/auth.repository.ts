import type { Prisma, User } from '@prisma/client';
import { prisma } from '../../common/prisma/prisma.js';

export class AuthRepository {
  async findUserByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(id: string) {
  return prisma.user.findUnique({
    where: {
      id,
    },
  });
}
  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    return prisma.user.create({
      data,
    });
  }

  async saveRefreshToken(data: {
  jti: string;
  tokenHash: string;
  expiresAt: Date;
  userId: string;
}) {
  return prisma.refreshToken.create({
    data,
  });
}

async findRefreshTokenByHash(
  tokenHash: string,
) {
  return prisma.refreshToken.findUnique({
    where: {
      tokenHash,
    },
  });
}

async deleteRefreshToken(
  id: string,
) {
  return prisma.refreshToken.delete({
    where: {
      id,
    },
  });
}


}