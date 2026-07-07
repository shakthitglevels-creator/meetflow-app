import { Router } from "express";
import {
  registerController,
  loginController,
} from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { profileController } from "../controllers/profile.controller";
import { refreshTokenController } from "../controllers/auth.controller";
import { logoutController } from "../controllers/auth.controller";

import { validate } from "../../../middleware/validate.middleware";
import { registerSchema } from "../validators/register.validator";
import { loginSchema } from "../validators/login.validator";

import { sendOtpController } from "../controllers/auth.controller";
import { verifyOtpController } from "../controllers/auth.controller";

import {
  forgotPasswordController,
  resetPasswordController,
} from "../controllers/auth.controller";
import { forgotPasswordSchema } from "../validators/forgot-password.validator";
import { resetPasswordSchema } from "../validators/reset-password.validator";

const authRouter = Router();

// POST /api/auth/register
authRouter.post("/register", validate(registerSchema), registerController);
authRouter.post("/login", validate(loginSchema), loginController);
authRouter.get("/profile", authMiddleware, profileController);
authRouter.post("/refresh-token", refreshTokenController);
authRouter.post("/logout", logoutController);

authRouter.post("/send-otp", sendOtpController);
authRouter.post("/verify-otp", verifyOtpController);

authRouter.post(
  "/forgot-password",
  validate(forgotPasswordSchema),
  forgotPasswordController,
);

authRouter.post(
  "/reset-password",
  validate(resetPasswordSchema),
  resetPasswordController,
);

export default authRouter;
