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

async deleteByJti(jti: string) {
  return prisma.refreshToken.deleteMany({
    where: {
      jti,
    },
  });
}

async revokeAllRefreshTokens(userId: string) {
  return prisma.refreshToken.deleteMany({
    where: {
      userId,
    },
  });
}

async updatePassword(
  userId: string,
  password: string,
) {
  return prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      password,
    },
  });
}

// update password using prisma transaction
async updatePasswordAndRevokeSessions(
  userId: string,
  hashedPassword: string,
): Promise<void> {
  await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: {
        id: userId,
      },
      data: {
        password: hashedPassword,
      },
    });

    await tx.refreshToken.deleteMany({
      where: {
        userId,
      },
    });
  });
}

// password reset
async savePasswordResetToken(data: {
  userId: string;
  tokenHash: string;
  expiresAt: Date;
}) {
  return prisma.passwordResetToken.create({
    data,
  });
}

// find password reset token by hash
async findPasswordResetTokenByHash(
  tokenHash: string,
) {
  return prisma.passwordResetToken.findUnique({
    where: {
      tokenHash,
    },
    include: {
      user: true,
    },
  });
}

// delete password reset token
async deletePasswordResetToken(
  id: string,
) {
  return prisma.passwordResetToken.delete({
    where: {
      id,
    },
  });
}

// delete all password reset token
async deleteAllPasswordResetTokens(
  userId: string,
) {
  return prisma.passwordResetToken.deleteMany({
    where: {
      userId,
    },
  });
}

// prisma transaction for reset password
async resetPasswordTransaction(data: {
  userId: string,
  hashedPassword: string,
  resetTokenId: string,
}
) {
  return prisma.$transaction(async (tx) => {

    await tx.user.update({
      where: {
        id: data.userId,
      },
      data: {
        password: data.hashedPassword,
      },
    });

    await tx.passwordResetToken.delete({
      where: {
        id: data.resetTokenId,
      },
    });

    await tx.refreshToken.deleteMany({
      where: {
        userId: data.userId,
      },
    });

  });
}

// delete all old password reset token and add new one
async replacePasswordResetToken(data: {
  userId: string;
  tokenHash: string;
  expiresAt: Date;
}) {
  return prisma.$transaction(async (tx) => {

    await tx.passwordResetToken.deleteMany({
      where: {
        userId: data.userId,
      },
    });

    return tx.passwordResetToken.create({
      data,
    });

  });
}


}