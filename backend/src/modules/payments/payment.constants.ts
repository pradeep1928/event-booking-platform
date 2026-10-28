export const PAYMENT_PROVIDER = {
  RAZORPAY: "RAZORPAY",
} as const;

export type PaymentProvider =
  (typeof PAYMENT_PROVIDER)[keyof typeof PAYMENT_PROVIDER];

export const DEFAULT_PAYMENT_CURRENCY = "INR";