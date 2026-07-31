"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { authService } from "@/services/auth.service";
import type {
  RegisterRequest,
} from "@/types/auth";

type RegisterErrorResponse = {
  success?: boolean;
  message?: string;
  code?: string;
  requiresVerification?: boolean;
  email?: string;

  data?: {
    code?: string;
    requiresVerification?: boolean;
    email?: string;
  };
};

export function useRegister() {
  const router = useRouter();

  return useMutation({
    mutationFn: (
      payload: RegisterRequest,
    ) => {
      return authService.register(payload);
    },

    onSuccess(response, variables) {
      toast.success(
        response.message ??
          "Account created successfully.",
      );

      router.push(
        `/verify-otp?email=${encodeURIComponent(
          variables.email,
        )}`,
      );
    },

    onError(
      error: unknown,
      variables,
    ) {
      if (
        axios.isAxiosError<
          RegisterErrorResponse
        >(error)
      ) {
        const response =
          error.response?.data;

        const errorCode =
          response?.code ??
          response?.data?.code;

        const requiresVerification =
          response?.requiresVerification ??
          response?.data
            ?.requiresVerification;

        /*
         * The account already exists but has
         * not completed email verification.
         */
        if (
          errorCode ===
            "EMAIL_NOT_VERIFIED" ||
          requiresVerification
        ) {
          toast.info(
            response?.message ??
              "Verify your email to continue.",
          );

          const email =
            response?.email ??
            response?.data?.email ??
            variables.email;

          router.push(
            `/verify-otp?email=${encodeURIComponent(
              email,
            )}`,
          );

          return;
        }

        if (
          errorCode ===
          "USER_ALREADY_EXISTS"
        ) {
          toast.error(
            response?.message ??
              "An account with this email already exists.",
          );

          return;
        }

        toast.error(
          response?.message ??
            "Unable to create your account.",
        );

        return;
      }

      if (error instanceof Error) {
        toast.error(error.message);
        return;
      }

      toast.error(
        "Unable to create your account.",
      );
    },
  });
}