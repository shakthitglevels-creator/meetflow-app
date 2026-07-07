import bcrypt from "bcryptjs";
import { User } from "../../../users/user.model";
import { Session } from "../models/session.model";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt";
import { redisClient } from "../../../config/redis";
import { generateOtp } from "../utils/otp";

import { sendEmail } from "../../../config/email";
import { createOtpEmailTemplate } from "../utils/otp-email-template";

import { createResetPasswordEmailTemplate } from "../utils/reset-password-email-template";

// handles register business logic
export const registerUserService = async (
  name: string,
  email: string,
  password: string,
) => {
  // check if email already exits
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new Error("User already exists");
  }

  // Convert plain password to hashed password
  const hashedPassword = await bcrypt.hash(password, 10);

  // create user in database
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  // Never return password to frontend
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    isEmailVerified: user.isEmailVerified,
  };
};

// Login
export const loginUserService = async (
  email: string,
  password: string,
  userAgent?: string,
  ipAddress?: string,
) => {
  // find user by email
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  // compare plain password with hashed password in DB
  const isPasswordMatch = await bcrypt.compare(password, user.password);

  if (!isPasswordMatch) {
    throw new Error("Invalid email or password");
  }

  if (!user.isEmailVerified) {
    throw new Error("Please verify your email before login");
  }

  // Small safe data stored inside JWT
  const tokenPayload = {
    userId: user._id.toString(),
    role: user.role,
  };

  // Create short-lived access token
  const accessToken = generateAccessToken(tokenPayload);

  // Create long-lived refresh token
  const refreshToken = generateRefreshToken(tokenPayload);

  // Session expires after 7 days
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  // Store refresh token in sessions collection
  await Session.create({
    userId: user._id,
    refreshToken,
    userAgent,
    ipAddress,
    expiresAt,
  });

  // Never return password to frontend
  return {
    accessToken,
    refreshToken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
    },
  };
};

// refresh token
// refresh access token using refresh token
export const refreshTokenService = async (refreshToken: string) => {
  // Verify JWT signature first
  const decoded = verifyRefreshToken(refreshToken);

  // Check if this refresh token still exists in database
  const session = await Session.findOne({
    refreshToken,
  });

  if (!session) {
    throw new Error("Invalid refresh token");
  }

  // Generate new access token
  const accessToken = generateAccessToken({
    userId: decoded.userId,
    role: decoded.role,
  });

  return {
    accessToken,
  };
};

// logout api
export const logoutService = async (refreshToken: string) => {
  const deletedSession = await Session.findOneAndDelete({ refreshToken });
  // Find and delete the session associated with the refresh token

  console.log("Deleted session:", deletedSession);

  if (!deletedSession) {
    throw new Error("Invalid refresh token");
  }

  return null;
};

// OTP service
export const sendOtpService = async (email: string) => {
  // redis key that actully stores the actual hashed otp
  const otpKey = `otp:${email}`;

  // redis key that controls resend cooldown
  const cooldownKey = `otp-cooldown:${email}`;

  // check if cooldown key already exists in redis
  const cooldownExists = await redisClient.get(cooldownKey);

  // if cooldown key exists, user requested otp too soon
  if (cooldownExists) {
    throw new Error("Please wait 60 seconds before requesting another OTP");
  }

  const otp = generateOtp();

  // Hash OTP before storing it in redis
  const hashedOtp = await bcrypt.hash(otp, 10);

  // store hashed otp for 5 mins
  await redisClient.set(otpKey, hashedOtp, {
    EX: 300,
  });

  // Store cooldown key for 60 seconds
  await redisClient.set(cooldownKey, "true", {
    EX: 60,
  });

  const html = createOtpEmailTemplate(otp);
  await sendEmail(
    email,
    "MeetFlow Email Verification OTP",
    `Your MeetFlow verification OTP is ${otp}. It is valid for 5 minutes.`,
    html,
  );

  return null;
};

// verify otp service
export const verifyOtpService = async (email: string, otp: string) => {
  const otpKey = `otp:${email}`;
  const attemptsKey = `otp-attempts:${email}`;

  // get hashed otp from redis
  const hashedOtp = await redisClient.get(otpKey);

  if (!hashedOtp) {
    throw new Error("OTP expired or not found");
  }

  // compare entered otp with hashed otp
  const isOtpValid = await bcrypt.compare(otp, hashedOtp);

  if (!isOtpValid) {
    // increase wrong attempsts count
    const attempts = await redisClient.incr(attemptsKey);

    // keep the attemts key alive as long as the otp key is alive
    await redisClient.expire(attemptsKey, 300);

    if (attempts >= 5) {
      // delete otp attempts after 5 wrong attempts
      await redisClient.del(otpKey);
      await redisClient.del(attemptsKey);

      throw new Error("Too many wrong attempts. Please request a new OTP");
    }

    throw new Error(`Invalid OTP. Attempts left: ${5 - attempts}`);
  }

  // mark user email as verified in database
  await User.findOneAndUpdate({ email }, { isEmailVerified: true });

  // Remove OTP after successful verification
  await redisClient.del(otpKey);
  await redisClient.del(attemptsKey);

  return null;
};

// forgotPasswordService
export const forgotPasswordService = async (email: string) => {
  // Check if user exists
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("User not found");
  }

  // Redis keys
  const otpKey = `reset-password-otp:${email}`;
  const cooldownKey = `reset-password-cooldown:${email}`;

  // Prevent OTP spam
  const cooldownExists = await redisClient.get(cooldownKey);

  if (cooldownExists) {
    throw new Error("Please wait 60 seconds before requesting another OTP");
  }

  // Generate secure OTP
  const otp = generateOtp();

  // Hash OTP before storing
  const hashedOtp = await bcrypt.hash(otp, 10);

  // Store hashed OTP for 5 minutes
  await redisClient.set(otpKey, hashedOtp, {
    EX: 300,
  });

  // Store cooldown for 60 seconds
  await redisClient.set(cooldownKey, "true", {
    EX: 60,
  });

  // Create HTML email
  const html = createResetPasswordEmailTemplate(otp);

  // Send email
  await sendEmail(
    email,
    "MeetFlow Password Reset OTP",
    `Your MeetFlow password reset OTP is ${otp}. It is valid for 5 minutes.`,
    html,
  );

  return null;
};


// resetPasswordService
export const resetPasswordService = async (
  email: string,
  otp: string,
  newPassword: string
) => {
  // Redis key where reset password OTP is stored
  const otpKey = `reset-password-otp:${email}`;

  // Get hashed OTP from Redis
  const hashedOtp = await redisClient.get(otpKey);

  if (!hashedOtp) {
    throw new Error("OTP expired or not found");
  }

  // Compare entered OTP with hashed OTP
  const isOtpValid = await bcrypt.compare(otp, hashedOtp);

  if (!isOtpValid) {
    throw new Error("Invalid OTP");
  }

  // Hash new password before storing
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Update user password
  await User.findOneAndUpdate(
    { email },
    { password: hashedPassword }
  );

  // Delete OTP after successful reset
  await redisClient.del(otpKey);

  return null;
};
