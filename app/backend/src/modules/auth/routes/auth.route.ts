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

import { googleAuthSchema } from "../validators/google-auth.validator";
import { googleLoginController } from "../controllers/auth.controller";

const authRouter = Router();

// POST /api/auth/register
/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Register a new user
 *     description: Creates a local MeetFlow account. The user must verify their email before logging in.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Shakthivel
 *               email:
 *                 type: string
 *                 format: email
 *                 example: shakthi@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *                 example: Password@123
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation failed
 *       409:
 *         description: User already exists
 */
authRouter.post("/register", validate(registerSchema), registerController);




/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Login with email and password
 *     description: Authenticates a verified local user and returns access and refresh tokens.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: shakthi@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Password@123
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       400:
 *         description: Validation failed
 *       401:
 *         description: Invalid email or password
 *       403:
 *         description: Email is not verified
 */
authRouter.post("/login", validate(loginSchema), loginController);

/**
 * @openapi
 * /api/auth/profile:
 *   get:
 *     tags:
 *       - Authentication
 *     summary: Get current user profile
 *     description: Returns the authenticated user's profile information.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile fetched successfully
 *       401:
 *         description: Missing, invalid, or expired access token
 */
authRouter.get("/profile", authMiddleware, profileController);

/**
 * @openapi
 * /api/auth/refresh-token:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Generate a new access token
 *     description: Uses a valid refresh token and active session to generate a new access token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: eyJhbGciOiJIUzI1NiIs...
 *     responses:
 *       200:
 *         description: Access token refreshed successfully
 *       400:
 *         description: Refresh token is required
 *       401:
 *         description: Invalid or expired refresh token
 */
authRouter.post("/refresh-token", refreshTokenController);

/**
 * @openapi
 * /api/auth/logout:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Logout current session
 *     description: Deletes the MongoDB session associated with the supplied refresh token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: eyJhbGciOiJIUzI1NiIs...
 *     responses:
 *       200:
 *         description: User logged out successfully
 *       400:
 *         description: Refresh token is required
 *       401:
 *         description: Invalid refresh token
 */
authRouter.post("/logout", logoutController);

/**
 * @openapi
 * /api/auth/send-otp:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Send email verification OTP
 *     description: Generates a secure OTP, stores its hash in Redis, and sends the OTP by email.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: shakthi@example.com
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *       400:
 *         description: Email is required or invalid
 *       429:
 *         description: OTP resend cooldown is active
 *       500:
 *         description: Email delivery failed
 */
authRouter.post("/send-otp", sendOtpController);

/**
 * @openapi
 * /api/auth/verify-otp:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Verify email OTP
 *     description: Verifies the OTP stored in Redis and marks the user's email as verified.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: shakthi@example.com
 *               otp:
 *                 type: string
 *                 minLength: 6
 *                 maxLength: 6
 *                 example: "138018"
 *     responses:
 *       200:
 *         description: Email verified successfully
 *       400:
 *         description: Invalid, expired, or missing OTP
 *       429:
 *         description: Too many invalid OTP attempts
 */
authRouter.post("/verify-otp", verifyOtpController);


/**
 * @openapi
 * /api/auth/forgot-password:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Send password-reset OTP
 *     description: Generates a password-reset OTP and sends it to the registered email address.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: shakthi@example.com
 *     responses:
 *       200:
 *         description: Password reset OTP sent successfully
 *       400:
 *         description: Validation failed
 *       404:
 *         description: User not found
 *       429:
 *         description: OTP resend cooldown is active
 */
authRouter.post(
  "/forgot-password",
  validate(forgotPasswordSchema),
  forgotPasswordController,
);

/**
 * @openapi
 * /api/auth/reset-password:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Reset password using OTP
 *     description: Verifies the password-reset OTP and replaces the user's password with a new hashed password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp
 *               - newPassword
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: shakthi@example.com
 *               otp:
 *                 type: string
 *                 minLength: 6
 *                 maxLength: 6
 *                 example: "138018"
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *                 example: NewPassword@123
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Validation failed, invalid OTP, or expired OTP
 */
authRouter.post(
  "/reset-password",
  validate(resetPasswordSchema),
  resetPasswordController,
);


/**
 * @openapi
 * /api/auth/google:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Login or register with Google
 *     description: Verifies a Google ID credential, finds or creates the user, and returns MeetFlow tokens.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - credential
 *             properties:
 *               credential:
 *                 type: string
 *                 example: eyJhbGciOiJSUzI1NiIs...
 *     responses:
 *       200:
 *         description: Google login successful
 *       400:
 *         description: Validation failed or invalid Google account information
 *       401:
 *         description: Invalid or expired Google credential
 */
authRouter.post(
  "/google",
  validate(googleAuthSchema),
  googleLoginController
);

export default authRouter;
