import type { Prisma, User } from "@prisma/client";
import { prisma } from "../../common/prisma/prisma.js";

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

  // find active user by id
  async findActiveUserById(id: string) {
    return prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        email: true,
        role: true,
        isActive: true,
      },
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

  async findRefreshTokenByHash(tokenHash: string) {
    return prisma.refreshToken.findUnique({
      where: {
        tokenHash,
      },
    });
  }

  async deleteRefreshToken(id: string) {
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

  async updatePassword(userId: string, password: string) {
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
  async findPasswordResetTokenByHash(tokenHash: string) {
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
  async deletePasswordResetToken(id: string) {
    return prisma.passwordResetToken.delete({
      where: {
        id,
      },
    });
  }

  // delete all password reset token
  async deleteAllPasswordResetTokens(userId: string) {
    return prisma.passwordResetToken.deleteMany({
      where: {
        userId,
      },
    });
  }

  // prisma transaction for reset password
  async resetPasswordTransaction(data: {
    userId: string;
    hashedPassword: string;
    resetTokenId: string;
  }) {
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

  // create email verification token
  async saveEmailVerificationToken(data: {
    userId: string;
    tokenHash: string;
    expiresAt: Date;
  }) {
    return prisma.emailVerificationToken.create({
      data,
    });
  }

  // find email verification token
  async findEmailVerificationTokenByHash(tokenHash: string) {
    return prisma.emailVerificationToken.findUnique({
      where: {
        tokenHash,
      },
      include: {
        user: true,
      },
    });
  }

  // delete email verification token
  async deleteEmailVerificationToken(id: string) {
    return prisma.emailVerificationToken.delete({
      where: {
        id,
      },
    });
  }

  // delete all email verification token
  async deleteAllEmailVerificationTokens(userId: string) {
    return prisma.emailVerificationToken.deleteMany({
      where: {
        userId,
      },
    });
  }

  // prisma transaction for replace email verification token - delete all old and add new one
  async replaceEmailVerificationToken(data: {
    userId: string;
    tokenHash: string;
    expiresAt: Date;
  }) {
    return prisma.$transaction(async (tx) => {
      await tx.emailVerificationToken.deleteMany({
        where: {
          userId: data.userId,
        },
      });

      return tx.emailVerificationToken.create({
        data,
      });
    });
  }

  // verify email and delete email verification token
  async markEmailVerifiedTransaction(data: {
    userId: string;
    verificationTokenId: string;
  }) {
    return prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: {
          id: data.userId,
        },
        data: {
          isVerified: true,
        },
      });

      await tx.emailVerificationToken.delete({
        where: {
          id: data.verificationTokenId,
        },
      });
    });
  }
}
