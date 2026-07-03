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
  const otp = generateOtp();

  // hash otp
  const hashedOtp = await bcrypt.hash(otp, 10);

  // redsis key for this user's otp
  const otpKey = `otp:${email}`;

  // store the otp for 5 minutes in redis
  await redisClient.set(otpKey, hashedOtp, {
    EX: 300,
  });

  console.log("OTP for testing", otp);
  return null;
};

// verify otp service
export const verifyOtpService = async (email: string, otp: string) => {
  const otpKey = `otp:${email}`;

  // get hashed otp from redis
  const hashedOtp = await redisClient.get(otpKey);

  if (!hashedOtp) {
    throw new Error("OTP has expired or is invalid");
  }

  // compare entered otp with hashed otp
  const isOtpValid = await bcrypt.compare(otp, hashedOtp);

  if (!isOtpValid) {
    throw new Error("Invalid OTP");
  }

  // mark user email as verified in database
  await User.findOneAndUpdate({ email }, { isEmailVerified: true });

  // Remove OTP after successful verification
  await redisClient.del(otpKey);

  return null;
};
