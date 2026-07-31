"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { authService } from "@/services/auth.service";
import type { VerifyOtpRequest } from "@/types/auth";

type ApiErrorResponse = {
  success?: boolean;
  message?: string;
};

function getVerifyOtpErrorMessage(
  error: unknown
): string {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    return (
      error.response?.data?.message ??
      "Unable to verify the OTP."
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Unable to verify the OTP.";
}

export function useVerifyOtp() {
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: VerifyOtpRequest) =>
      authService.verifyOtp(payload),

    onSuccess(response) {
      toast.success(
        response.message ??
          "Your account has been verified successfully."
      );

      router.replace("/login?verified=true");
    },

    onError(error: unknown) {
      toast.error(
        getVerifyOtpErrorMessage(error)
      );
    },
  });
}