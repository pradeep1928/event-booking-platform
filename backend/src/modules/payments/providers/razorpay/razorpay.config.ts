import { env } from "../../../../config/env.js";

export const razorpayConfig = {
  keyId: env.RAZORPAY_KEY_ID,
  keySecret: env.RAZORPAY_KEY_SECRET,
  webhookSecret: env.RAZORPAY_WEBHOOK_SECRET,
} as const;