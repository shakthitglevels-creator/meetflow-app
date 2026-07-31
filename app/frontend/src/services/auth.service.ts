import { apiClient } from "@/services/api-client";

import type {
  ApiResponse,
  AuthUser,
  ForgotPasswordRequest,
  GoogleLoginRequest,
  LoginRequest,
  LoginResponseData,
  LogoutRequest,
  RefreshTokenRequest,
  RefreshTokenResponseData,
  RegisterRequest,
  RegisterResponseData,
  ResetPasswordRequest,
  SendOtpRequest,
  VerifyOtpRequest,
} from "@/types/auth";

export const authService = {
  register: async (
    payload: RegisterRequest
  ): Promise<ApiResponse<RegisterResponseData>> => {
    const response = await apiClient.post<
      ApiResponse<RegisterResponseData>
    >("/auth/register", payload);

    return response.data;
  },

  login: async (
    payload: LoginRequest
  ): Promise<ApiResponse<LoginResponseData>> => {
    const response = await apiClient.post<
      ApiResponse<LoginResponseData>
    >("/auth/login", payload);

    return response.data;
  },

  sendOtp: async (
    payload: SendOtpRequest
  ): Promise<ApiResponse<null>> => {
    const response = await apiClient.post<
      ApiResponse<null>
    >("/auth/send-otp", payload);

    return response.data;
  },

  verifyOtp: async (
    payload: VerifyOtpRequest
  ): Promise<ApiResponse<null>> => {
    const response = await apiClient.post<
      ApiResponse<null>
    >("/auth/verify-otp", payload);

    return response.data;
  },

  getProfile: async (): Promise<
    ApiResponse<AuthUser>
  > => {
    const response = await apiClient.get<
      ApiResponse<AuthUser>
    >("/auth/profile");

    return response.data;
  },

  forgotPassword: async (
    payload: ForgotPasswordRequest
  ): Promise<ApiResponse<null>> => {
    const response = await apiClient.post<
      ApiResponse<null>
    >("/auth/forgot-password", payload);

    return response.data;
  },

  resetPassword: async (
    payload: ResetPasswordRequest
  ): Promise<ApiResponse<null>> => {
    const response = await apiClient.post<
      ApiResponse<null>
    >("/auth/reset-password", payload);

    return response.data;
  },

  refreshToken: async (
    payload: RefreshTokenRequest
  ): Promise<ApiResponse<RefreshTokenResponseData>> => {
    const response = await apiClient.post<
      ApiResponse<RefreshTokenResponseData>
    >("/auth/refresh-token", payload);

    return response.data;
  },

  logout: async (
    payload: LogoutRequest
  ): Promise<ApiResponse<null>> => {
    const response = await apiClient.post<
      ApiResponse<null>
    >("/auth/logout", payload);

    return response.data;
  },

  googleLogin: async (
    payload: GoogleLoginRequest
  ): Promise<ApiResponse<LoginResponseData>> => {
    const response = await apiClient.post<
      ApiResponse<LoginResponseData>
    >("/auth/google", payload);

    return response.data;
  },
};