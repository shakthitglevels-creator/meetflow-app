// User roles currently supported by MeetFlow
export type UserRole = "user" | "admin";

// Authentication providers supported by the backend
export type AuthProvider = "local" | "google";

// Safe user data returned by the backend
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string | null;
  authProvider?: AuthProvider;
  isEmailVerified: boolean;
  lastLoginAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

// Common response wrapper used by the backend
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: unknown[];
}

// Register endpoint request
export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

// Register endpoint response data
export interface RegisterResponseData {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isEmailVerified: boolean;
}

// Login endpoint request
export interface LoginRequest {
  email: string;
  password: string;
}

// Login endpoint response data
export interface LoginResponseData {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

// Send OTP request
export interface SendOtpRequest {
  email: string;
}

// Verify OTP request
export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

// Forgot password request
export interface ForgotPasswordRequest {
  email: string;
}

// Reset password request
export interface ResetPasswordRequest {
  email: string;
  otp: string;
  newPassword: string;
}

// Refresh token request
export interface RefreshTokenRequest {
  refreshToken: string;
}

// Refresh token response data
export interface RefreshTokenResponseData {
  accessToken: string;
}

// Logout request
export interface LogoutRequest {
  refreshToken: string;
}

// Google authentication request
export interface GoogleLoginRequest {
  credential: string;
}