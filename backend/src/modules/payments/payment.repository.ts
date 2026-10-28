import {
  PaymentStatus,
  Prisma,
} from "@prisma/client";

import { prisma } from "../../common/prisma/prisma.js";

export class PaymentRepository {
  async create(
    data: Prisma.PaymentCreateInput,
  ) {
    return prisma.payment.create({
      data,
    });
  }

  async markPending(
    paymentId: string,
    providerOrderId: string,
  ) {
    return prisma.payment.update({
      where: {
        id: paymentId,
      },
      data: {
        providerOrderId,
        status: PaymentStatus.PENDING,
      },
    });
  }

  async markFailed(
    paymentId: string,
    reason?: string,
  ) {
    return prisma.payment.update({
      where: {
        id: paymentId,
      },
      data: {
        status: PaymentStatus.FAILED,
        failedAt: new Date(),
        failureReason:
          reason ??
          "Payment initialization failed",
      },
    });
  }

  async findById(id: string) {
    return prisma.payment.findUnique({
      where: {
        id,
      },
      include: {
        booking: true,
      },
    });
  }

  async findByProviderOrderId(
    providerOrderId: string,
  ) {
    return prisma.payment.findUnique({
      where: {
        providerOrderId,
      },
      include: {
        booking: true,
      },
    });
  }
}