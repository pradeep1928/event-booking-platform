import Razorpay from "razorpay";

import type {
  CreatePaymentOrderInput,
  CreatePaymentOrderResult,
  PaymentGateway,
} from "../../contracts/payment-gateway.interface.js";

import { razorpayConfig } from "./razorpay.config.js";

export class RazorpayGateway
  implements PaymentGateway
{
  private readonly client: Razorpay;

  constructor() {
    this.client = new Razorpay({
      key_id: razorpayConfig.keyId,
      key_secret: razorpayConfig.keySecret,
    });
  }

  async createOrder(
    input: CreatePaymentOrderInput,
  ): Promise<CreatePaymentOrderResult> {
    const order =
      await this.client.orders.create({
        amount: input.amountMinor,
        currency: input.currency,
        receipt: input.receipt,
        notes: input.notes,
      });

    return {
      orderId: order.id,
      amountMinor: Number(order.amount),
      currency: order.currency,
    };
  }
}