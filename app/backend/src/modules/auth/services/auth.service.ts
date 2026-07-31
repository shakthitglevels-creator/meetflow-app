


import bcrypt from "bcryptjs";

import { redisClient } from "../../../config/redis";
import { sendEmail } from "../../../config/email";
import { AppError } from "../../../shared/errors/app-error";

import {
  createUser,
  findUserByEmail,
  findUserById,
  markUserEmailAsVerified,
  updateLastLoginAt,
  updateUserPassword,
} from "../../users/repositories/user.repository";

import { Session } from "../models/session.model";

import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt";

import { generateOtp } from "../utils/otp";
import { createOtpEmailTemplate } from "../utils/otp-email-template";
import { createResetPasswordEmailTemplate } from "../utils/reset-password-email-template";

import { verifyGoogleCredential } from "../providers/google.provider";

const OTP_EXPIRY_SECONDS = 300;
const OTP_COOLDOWN_SECONDS = 60;
const OTP_MAX_ATTEMPTS = 5;

/*
 * Ensures that email lookup, Redis keys and
 * MongoDB records always use the same format.
 */
const normalizeEmail = (email: string): string => {
  return email.trim().toLowerCase();
};

/*
 * Create an authenticated device session only
 * after the account has passed all security checks.
 */
const createAuthenticationSession = async (
  userId: string,
  role: "user" | "admin",
  userAgent?: string,
  ipAddress?: string,
) => {
  const tokenPayload = {
    userId,
    role,
  };

  const accessToken =
    generateAccessToken(tokenPayload);

  const refreshToken =
    generateRefreshToken(tokenPayload);

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  await Session.create({
    userId,
    refreshToken,
    userAgent,
    ipAddress,
    expiresAt,
  });

  return {
    accessToken,
    refreshToken,
  };
};

/*
 * Creates and sends an email-verification OTP.
 *
 * This helper is used by both registration
 * and the resend-OTP endpoint.
 */
const createAndSendVerificationOtp = async (
  email: string,
): Promise<void> => {
  const normalizedEmail = normalizeEmail(email);

  const otpKey =
    `email-verification:otp:${normalizedEmail}`;

  const attemptsKey =
    `email-verification:attempts:${normalizedEmail}`;

  const cooldownKey =
    `email-verification:cooldown:${normalizedEmail}`;

  const cooldownExists =
    await redisClient.get(cooldownKey);

  if (cooldownExists) {
    throw new AppError(
      "Please wait 60 seconds before requesting another OTP",
      429,
    );
  }

  const otp = generateOtp();

  /*
   * Bcrypt is acceptable here because the OTP
   * will be verified using bcrypt.compare().
   */
  const hashedOtp = await bcrypt.hash(otp, 10);

  /*
   * Remove any previous attempt counter when
   * issuing a new OTP.
   */
  await redisClient.del(attemptsKey);

  await redisClient.set(
    otpKey,
    hashedOtp,
    {
      EX: OTP_EXPIRY_SECONDS,
    },
  );

  await redisClient.set(
    cooldownKey,
    "true",
    {
      EX: OTP_COOLDOWN_SECONDS,
    },
  );

  const html =
    createOtpEmailTemplate(otp);

  try {
    await sendEmail(
      normalizedEmail,
      "MeetFlow Email Verification OTP",
      `Your MeetFlow verification OTP is ${otp}. It is valid for 5 minutes.`,
      html,
    );
  } catch (error) {
    /*
     * Do not leave a usable OTP in Redis when
     * email delivery fails.
     */
    await redisClient.del(otpKey);
    await redisClient.del(attemptsKey);

    throw error;
  }
};

// Register a local account
export const registerUserService = async (
  name: string,
  email: string,
  password: string,
) => {
  const normalizedEmail = normalizeEmail(email);

  // const existingUser =
  //   await findUserByEmail(normalizedEmail);

  // /*
  //  * Already active or already Google-linked users
  //  * cannot be registered again.
  //  */
  // if (
  //   existingUser &&
  //   (
  //     existingUser.isEmailVerified ||
  //     existingUser.status === "active" ||
  //     existingUser.authProvider === "google"
  //   )
  // ) {
  //   throw new AppError(
  //     "User already exists",
  //     409,
  //   );
  // }

  const existingUser =
  await findUserByEmail(normalizedEmail);

if (existingUser) {
  if (
    !existingUser.isEmailVerified &&
    existingUser.status ===
      "pending_verification"
  ) {
    throw new AppError(
      "This email is registered but not verified. Please verify your account.",
      409,
      {
        code: "EMAIL_NOT_VERIFIED",
        requiresVerification: true,
        email: existingUser.email,
      },
    );
  }

  throw new AppError(
    "An account with this email already exists.",
    409,
    {
      code: "USER_ALREADY_EXISTS",
    },
  );
}

  /*
   * If a pending user already exists, do not create
   * another MongoDB document because email is unique.
   *
   * Send a new OTP through the resend endpoint instead.
   */
  if (existingUser) {
    throw new AppError(
      "This email is already registered but not verified. Please verify your account or request a new OTP.",
      409,
    );
  }

  const hashedPassword =
    await bcrypt.hash(password, 10);

  const user = await createUser({
    name: name.trim(),
    email: normalizedEmail,
    password: hashedPassword,

    authProvider: "local",
    role: "user",

    status: "pending_verification",
    isEmailVerified: false,
    emailVerifiedAt: null,
  });

  try {
    await createAndSendVerificationOtp(
      normalizedEmail,
    );
  } catch (error) {
    /*
     * The pending user remains in MongoDB if email
     * sending fails. The user can later request a
     * new OTP without creating a duplicate account.
     */
    throw new AppError(
      "Account created, but the verification email could not be sent. Please request a new OTP.",
      503,
    );
  }

  /*
   * Registration must not generate JWTs or sessions.
   */
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
    isEmailVerified: user.isEmailVerified,
    requiresVerification: true,
  };
};

// Login using email and password
export const loginUserService = async (
  email: string,
  password: string,
  userAgent?: string,
  ipAddress?: string,
) => {
  const normalizedEmail = normalizeEmail(email);

  const user =
    await findUserByEmail(normalizedEmail);

  if (!user) {
    throw new AppError(
      "Invalid email or password",
      401,
    );
  }

  if (!user.password) {
    throw new AppError(
      "Please continue with Google to access this account",
      401,
    );
  }

  const isPasswordMatch =
    await bcrypt.compare(
      password,
      user.password,
    );

  if (!isPasswordMatch) {
    throw new AppError(
      "Invalid email or password",
      401,
    );
  }

  /*
   * Never generate JWTs for an unverified user.
   */
  if (!user.isEmailVerified) {
    throw new AppError(
      "Please verify your email before login",
      403,
    );
  }

  /*
   * Email verification alone is not enough.
   * Suspended or pending accounts must be blocked.
   */
  if (user.status !== "active") {
    throw new AppError(
      "This account is not active",
      403,
    );
  }

  const tokens =
    await createAuthenticationSession(
      user._id.toString(),
      user.role,
      userAgent,
      ipAddress,
    );

  await updateLastLoginAt(
    user._id.toString(),
  );

  return {
    ...tokens,

    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      role: user.role,
      status: user.status,
      isEmailVerified:
        user.isEmailVerified,
      authProvider: user.authProvider,
    },
  };
};

// Generate a new access token using a refresh token
export const refreshTokenService = async (
  refreshToken: string,
) => {
  const decoded =
    verifyRefreshToken(refreshToken);

  const session = await Session.findOne({
    refreshToken,
    expiresAt: {
      $gt: new Date(),
    },
  });

  if (!session) {
    throw new AppError(
      "Invalid refresh token",
      401,
    );
  }

  /*
   * Load the latest user state.
   *
   * This blocks suspended or deactivated users
   * even when they still possess a refresh token.
   */
  const user = await findUserById(
    decoded.userId,
  );

  if (
    !user ||
    !user.isEmailVerified ||
    user.status !== "active"
  ) {
    await Session.deleteMany({
      userId: decoded.userId,
    });

    throw new AppError(
      "Account is not active",
      401,
    );
  }

  const accessToken =
    generateAccessToken({
      userId: user._id.toString(),
      role: user.role,
    });

  return {
    accessToken,
  };
};

// Logout and invalidate one device session
export const logoutService = async (
  refreshToken: string,
) => {
  const deletedSession =
    await Session.findOneAndDelete({
      refreshToken,
    });

  if (!deletedSession) {
    throw new AppError(
      "Invalid refresh token",
      401,
    );
  }

  return null;
};

// Send or resend an email-verification OTP
export const sendOtpService = async (
  email: string,
) => {
  const normalizedEmail = normalizeEmail(email);

  const user =
    await findUserByEmail(normalizedEmail);

  if (!user) {
    throw new AppError(
      "Account not found",
      404,
    );
  }

  if (user.isEmailVerified) {
    throw new AppError(
      "This account is already verified",
      409,
    );
  }

  if (
    user.status !==
    "pending_verification"
  ) {
    throw new AppError(
      "OTP verification is not available for this account",
      403,
    );
  }

  await createAndSendVerificationOtp(
    normalizedEmail,
  );

  return null;
};

// Verify the six-digit email OTP
export const verifyOtpService = async (
  email: string,
  otp: string,
) => {
  const normalizedEmail = normalizeEmail(email);

  if (!/^\d{6}$/.test(otp)) {
    throw new AppError(
      "OTP must contain exactly 6 digits",
      400,
    );
  }

  const user =
    await findUserByEmail(normalizedEmail);

  if (!user) {
    throw new AppError(
      "Invalid or expired verification code",
      401,
    );
  }

  if (user.isEmailVerified) {
    if (user.status === "active") {
      return null;
    }

    throw new AppError(
      "This account is not active",
      403,
    );
  }

  if (
    user.status !==
    "pending_verification"
  ) {
    throw new AppError(
      "This account cannot be verified",
      403,
    );
  }

  const otpKey =
    `email-verification:otp:${normalizedEmail}`;

  const attemptsKey =
    `email-verification:attempts:${normalizedEmail}`;

  const hashedOtp =
    await redisClient.get(otpKey);

  if (!hashedOtp) {
    throw new AppError(
      "OTP expired or not found",
      401,
    );
  }

  const currentAttemptsValue =
    await redisClient.get(attemptsKey);

  const currentAttempts = Number(
    currentAttemptsValue ?? "0",
  );

  if (
    currentAttempts >=
    OTP_MAX_ATTEMPTS
  ) {
    await redisClient.del(otpKey);
    await redisClient.del(attemptsKey);

    throw new AppError(
      "Too many wrong attempts. Please request a new OTP",
      429,
    );
  }

  const isOtpValid =
    await bcrypt.compare(
      otp,
      hashedOtp,
    );

  if (!isOtpValid) {
    const attempts =
      await redisClient.incr(
        attemptsKey,
      );

    /*
     * Keep attempts alive for the same duration
     * as the current OTP.
     */
    const otpTimeToLive =
      await redisClient.ttl(otpKey);

    if (otpTimeToLive > 0) {
      await redisClient.expire(
        attemptsKey,
        otpTimeToLive,
      );
    }

    if (
      attempts >=
      OTP_MAX_ATTEMPTS
    ) {
      await redisClient.del(otpKey);
      await redisClient.del(attemptsKey);

      throw new AppError(
        "Too many wrong attempts. Please request a new OTP",
        429,
      );
    }

    throw new AppError(
      `Invalid OTP. Attempts left: ${
        OTP_MAX_ATTEMPTS - attempts
      }`,
      401,
    );
  }

  const verifiedUser =
    await markUserEmailAsVerified(
      user._id.toString(),
    );

  if (!verifiedUser) {
    throw new AppError(
      "The account could not be activated",
      409,
    );
  }

  await redisClient.del(otpKey);
  await redisClient.del(attemptsKey);

  return null;
};

// Send password-reset OTP
export const forgotPasswordService = async (
  email: string,
) => {
  const normalizedEmail = normalizeEmail(email);

  const user =
    await findUserByEmail(normalizedEmail);

  /*
   * For stronger account-enumeration protection,
   * this endpoint can return success even when the
   * user does not exist.
   */
  if (!user) {
    throw new AppError(
      "User not found",
      404,
    );
  }

  if (
    !user.isEmailVerified ||
    user.status !== "active"
  ) {
    throw new AppError(
      "This account is not active",
      403,
    );
  }

  if (!user.password) {
    throw new AppError(
      "This account uses Google authentication",
      400,
    );
  }

  const otpKey =
    `reset-password:otp:${normalizedEmail}`;

  const cooldownKey =
    `reset-password:cooldown:${normalizedEmail}`;

  const attemptsKey =
    `reset-password:attempts:${normalizedEmail}`;

  const cooldownExists =
    await redisClient.get(cooldownKey);

  if (cooldownExists) {
    throw new AppError(
      "Please wait 60 seconds before requesting another OTP",
      429,
    );
  }

  const otp = generateOtp();

  const hashedOtp =
    await bcrypt.hash(otp, 10);

  await redisClient.del(attemptsKey);

  await redisClient.set(
    otpKey,
    hashedOtp,
    {
      EX: OTP_EXPIRY_SECONDS,
    },
  );

  await redisClient.set(
    cooldownKey,
    "true",
    {
      EX: OTP_COOLDOWN_SECONDS,
    },
  );

  const html =
    createResetPasswordEmailTemplate(
      otp,
    );

  try {
    await sendEmail(
      normalizedEmail,
      "MeetFlow Password Reset OTP",
      `Your MeetFlow password reset OTP is ${otp}. It is valid for 5 minutes.`,
      html,
    );
  } catch (error) {
    await redisClient.del(otpKey);
    await redisClient.del(attemptsKey);

    throw error;
  }

  return null;
};

// Reset password using the six-digit reset OTP
export const resetPasswordService = async (
  email: string,
  otp: string,
  newPassword: string,
) => {
  const normalizedEmail = normalizeEmail(email);

  if (!/^\d{6}$/.test(otp)) {
    throw new AppError(
      "OTP must contain exactly 6 digits",
      400,
    );
  }

  const user =
    await findUserByEmail(normalizedEmail);

  if (!user) {
    throw new AppError(
      "Invalid or expired OTP",
      401,
    );
  }

  if (
    !user.isEmailVerified ||
    user.status !== "active"
  ) {
    throw new AppError(
      "This account is not active",
      403,
    );
  }

  const otpKey =
    `reset-password:otp:${normalizedEmail}`;

  const attemptsKey =
    `reset-password:attempts:${normalizedEmail}`;

  const hashedOtp =
    await redisClient.get(otpKey);

  if (!hashedOtp) {
    throw new AppError(
      "OTP expired or not found",
      401,
    );
  }

  const isOtpValid =
    await bcrypt.compare(
      otp,
      hashedOtp,
    );

  if (!isOtpValid) {
    const attempts =
      await redisClient.incr(
        attemptsKey,
      );

    const otpTimeToLive =
      await redisClient.ttl(otpKey);

    if (otpTimeToLive > 0) {
      await redisClient.expire(
        attemptsKey,
        otpTimeToLive,
      );
    }

    if (
      attempts >=
      OTP_MAX_ATTEMPTS
    ) {
      await redisClient.del(otpKey);
      await redisClient.del(attemptsKey);

      throw new AppError(
        "Too many wrong attempts. Request a new password-reset OTP",
        429,
      );
    }

    throw new AppError(
      `Invalid OTP. Attempts left: ${
        OTP_MAX_ATTEMPTS - attempts
      }`,
      401,
    );
  }

  const hashedPassword =
    await bcrypt.hash(
      newPassword,
      10,
    );

  await updateUserPassword(
    user._id.toString(),
    hashedPassword,
  );

  /*
   * Password reset invalidates existing sessions.
   */
  await Session.deleteMany({
    userId: user._id,
  });

  await redisClient.del(otpKey);
  await redisClient.del(attemptsKey);

  return null;
};

// Google sign-up and login
export const googleLoginService = async (
  credential: string,
  userAgent?: string,
  ipAddress?: string,
) => {
  const googleUser =
    await verifyGoogleCredential(
      credential,
    );

  const normalizedEmail =
    normalizeEmail(googleUser.email);

  let user =
    await findUserByEmail(
      normalizedEmail,
    );

  if (!user) {
    user = await createUser({
      name: googleUser.name,
      email: normalizedEmail,
      avatar: googleUser.avatar,
      googleId: googleUser.googleId,

      authProvider: "google",
      role: "user",

      status: "active",
      isEmailVerified: true,
      emailVerifiedAt: new Date(),
    });
  } else {
    if (user.status === "suspended") {
      throw new AppError(
        "This account has been suspended",
        403,
      );
    }

    /*
     * A successfully verified Google credential
     * confirms ownership of the email address.
     */
    user.googleId =
      googleUser.googleId;

    user.avatar =
      googleUser.avatar ??
      user.avatar;

    user.isEmailVerified = true;
    user.emailVerifiedAt ??=
      new Date();

    user.status = "active";

    await user.save();
  }

  const tokens =
    await createAuthenticationSession(
      user._id.toString(),
      user.role,
      userAgent,
      ipAddress,
    );

  await updateLastLoginAt(
    user._id.toString(),
  );

  return {
    ...tokens,

    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      role: user.role,
      status: user.status,
      isEmailVerified:
        user.isEmailVerified,
      authProvider:
        user.authProvider,
    },
  };
};