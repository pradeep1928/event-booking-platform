import { PaymentStatus, Prisma } from "@prisma/client";

import { PaymentRepository } from "./payment.repository.js";

import type { PaymentGateway } from "./contracts/payment-gateway.interface.js";

import { RazorpayGateway } from "./providers/razorpay/razorpay.gateway.js";

import {
  DEFAULT_PAYMENT_CURRENCY,
  PAYMENT_PROVIDER,
} from "./payment.constants.js";

import { toMinorCurrencyUnit } from "../../common/utils/money.util.js";

type InitializePaymentInput = {
  bookingId: string;

  userId: string;
  eventId: string;

  totalAmount: Prisma.Decimal;
};

export class PaymentService {
  constructor(
    private readonly repository = new PaymentRepository(),
    private readonly gateway: PaymentGateway = new RazorpayGateway(),
  ) {}

  async initialize(input: InitializePaymentInput) {
    const amountMinor = toMinorCurrencyUnit(input.totalAmount);

    if (amountMinor <= 0) {
      throw new Error("Payment amount must be greater than zero");
    }

    /*
     * Create our internal payment first.
     *
     * If Razorpay is unavailable we still retain
     * an audit record of the attempt.
     */
    const payment = await this.repository.create({
      provider: PAYMENT_PROVIDER.RAZORPAY,

      amountMinor,

      currency: DEFAULT_PAYMENT_CURRENCY,

      status: PaymentStatus.CREATED,

      booking: {
        connect: {
          id: input.bookingId,
        },
      },
    });

    try {
      const providerOrder = await this.gateway.createOrder({
        amountMinor,

        currency: DEFAULT_PAYMENT_CURRENCY,

        receipt: payment.id,

        notes: {
          bookingId: input.bookingId,

          eventId: input.eventId,

          userId: input.userId,
        },
      });

      const updatedPayment = await this.repository.markPending(
        payment.id,
        providerOrder.orderId,
      );

      return {
        paymentId: updatedPayment.id,

        provider: PAYMENT_PROVIDER.RAZORPAY,

        providerOrderId: providerOrder.orderId,

        amountMinor: providerOrder.amountMinor,

        currency: providerOrder.currency,
      };
    } catch (error) {
      await this.repository.markFailed(payment.id, getErrorMessage(error));

      throw error;
    }
  }
}

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) {
    return error.message;
  }

  return "Payment initialization failed";
};
