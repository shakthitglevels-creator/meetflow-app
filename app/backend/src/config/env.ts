// Library imports
import dotenv from "dotenv";

// load variables from .env to process.env
dotenv.config();

// exports config values everywhere so we dont use process.env everywhere
export const env = {
  PORT: process.env.PORT || "5000",
  NODE_ENV: process.env.NODE_ENV || "development",
  // MongoDB connections string
  MONGODB_URI: process.env.MONGODB_URI || "",

  // JWT configuration
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || "",
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || "",
  JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || "7d",

  SMTP_HOST: process.env.SMTP_HOST || "",
  SMTP_PORT: process.env.SMTP_PORT || 587,
  SMTP_USER: process.env.SMTP_USER || "",
  SMTP_PASS: process.env.SMTP_PASS || "",

  // Google OAuth configuration
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || "",
};
