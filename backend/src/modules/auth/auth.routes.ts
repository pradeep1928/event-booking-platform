import { Router } from "express";
import { AuthController } from "./auth.controller.js";
import { asyncHandler } from "../../common/utils/async-handler.js";
import { authenticate } from "../../common/middlware/auth.middleware.js";
import { forgotPasswordLimiter, loginLimiter, refreshTokenLimiter, registerLimiter, resendVerificationLimiter, resetPasswordLimiter } from "../../common/middlware/auth-rate-limit.js";

const router = Router();
const controller = new AuthController();

// old without asyncHandler
// router.post('/register', controller.register);

// with asyncHandler register user
router.post("/register", registerLimiter, asyncHandler(controller.register));

// login user
router.post("/login", loginLimiter, asyncHandler(controller.login));

// test token
router.get("/me", authenticate, asyncHandler(controller.me));

// refresh token
router.post("/refresh-token", refreshTokenLimiter, asyncHandler(controller.refreshToken));

// logout user
router.post("/logout", asyncHandler(controller.logout));

// logout user all
router.post("/logout-all", authenticate, asyncHandler(controller.logoutAll));

// change password
router.patch(
  "/change-password",
  authenticate,
  asyncHandler(controller.changePassword),
);

// forgot password
router.post("/forgot-password", forgotPasswordLimiter, asyncHandler(controller.forgotPassword)),
  // reset password
  
router.post("/reset-password", resetPasswordLimiter, asyncHandler(controller.resetPassword));

// verify email
router.post("/verify-email", asyncHandler(controller.verifyEmail));

// resend verify email
router.post(
  "/resend-verification-email",
  resendVerificationLimiter,
  asyncHandler(controller.resendVerificationEmail),
);

export default router;
