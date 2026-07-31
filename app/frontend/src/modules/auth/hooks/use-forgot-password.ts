"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { authService } from "@/services/auth.service";
import type {
  ForgotPasswordRequest,
} from "@/types/auth";

type ForgotPasswordErrorResponse = {
  success?: boolean;
  message?: string;
};

export function useForgotPassword() {
  const router = useRouter();

  return useMutation({
    mutationFn: (
      payload: ForgotPasswordRequest,
    ) => {
      return authService.forgotPassword(
        payload,
      );
    },

    onSuccess(response, variables) {
      toast.success(
        response.message ??
          "Password-reset code sent.",
      );

      router.push(
        `/reset-password?email=${encodeURIComponent(
          variables.email,
        )}`,
      );
    },

    onError(error: unknown) {
      if (
        axios.isAxiosError<
          ForgotPasswordErrorResponse
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
            "Unable to send the reset code.",
        );

        return;
      }

      if (error instanceof Error) {
        toast.error(error.message);
        return;
      }

      toast.error(
        "Unable to send the reset code.",
      );
    },
  });
}