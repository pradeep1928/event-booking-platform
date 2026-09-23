import { createRateLimiter } from "./rate-limit.middleware.js";

export const loginLimiter = createRateLimiter({
  windowMs: 10 * 60 * 1000,
  max: 5,
  useEmail: true,
});

export const registerLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000,
  max: 100,
});

export const forgotPasswordLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000,
  max: 5,
  useEmail: true,
});

export const resetPasswordLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000,
  max: 5,
});

export const refreshTokenLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000,
  max: 30,
});

export const resendVerificationLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000,
  max: 30,
});
