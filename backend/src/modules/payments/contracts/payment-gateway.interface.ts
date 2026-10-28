export type CreatePaymentOrderInput = {
  amountMinor: number;
  currency: string;
  receipt: string;

  notes?: Record<string, string>;
};

export type CreatePaymentOrderResult = {
  orderId: string;
  amountMinor: number;
  currency: string;
};

export interface PaymentGateway {
  createOrder(
    input: CreatePaymentOrderInput,
  ): Promise<CreatePaymentOrderResult>;
}