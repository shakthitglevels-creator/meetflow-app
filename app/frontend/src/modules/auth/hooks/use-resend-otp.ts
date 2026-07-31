"use client";

import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { authService } from "@/services/auth.service";
import type { SendOtpRequest } from "@/types/auth";

type ApiErrorResponse = {
  success?: boolean;
  message?: string;
};

function getResendOtpErrorMessage(
  error: unknown
): string {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    return (
      error.response?.data?.message ??
      "Unable to resend the OTP."
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Unable to resend the OTP.";
}

export function useResendOtp() {
  return useMutation({
    mutationFn: (payload: SendOtpRequest) =>
      authService.sendOtp(payload),

    onSuccess(response) {
      toast.success(
        response.message ??
          "A new OTP has been sent to your email."
      );
    },

    onError(error: unknown) {
      toast.error(
        getResendOtpErrorMessage(error)
      );
    },
  });
}