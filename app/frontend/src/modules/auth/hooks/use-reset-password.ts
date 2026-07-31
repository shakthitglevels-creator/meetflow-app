"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { authService } from "@/services/auth.service";
import type {
  ResetPasswordRequest,
} from "@/types/auth";

type ResetPasswordErrorResponse = {
  success?: boolean;
  message?: string;
};

export function useResetPassword() {
  const router = useRouter();

  return useMutation({
    mutationFn: (
      payload: ResetPasswordRequest,
    ) => {
      return authService.resetPassword(
        payload,
      );
    },

    onSuccess(response) {
      toast.success(
        response.message ??
          "Password changed successfully.",
      );

      router.replace(
        "/login?passwordReset=true",
      );
    },

    onError(error: unknown) {
      if (
        axios.isAxiosError<
          ResetPasswordErrorResponse
        >(error)
      ) {
        if (!error.response) {
          toast.error(
            "Cannot connect to the backend.",
          );

          return;
        }

        toast.error(
          error.response.data?.message ??
            "Unable to reset your password.",
        );

        return;
      }

      if (error instanceof Error) {
        toast.error(error.message);
        return;
      }

      toast.error(
        "Unable to reset your password.",
      );
    },
  });
}