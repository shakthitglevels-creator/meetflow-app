"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { authService } from "@/services/auth.service";
import type {
  GoogleLoginRequest,
} from "@/types/auth";

import { useAuthStore } from "../store/auth.store";

type GoogleLoginErrorResponse = {
  success?: boolean;
  message?: string;
};

export function useGoogleLogin() {
  const router = useRouter();

  const setAuth = useAuthStore(
    (state) => state.setAuth,
  );

  return useMutation({
    mutationFn: (
      payload: GoogleLoginRequest,
    ) => {
      return authService.googleLogin(
        payload,
      );
    },

    onSuccess(response) {
      setAuth({
        user: response.data.user,
        accessToken:
          response.data.accessToken,
        refreshToken:
          response.data.refreshToken,
      });

      toast.success(
        response.message ??
          "Signed in with Google successfully.",
      );

      router.replace("/dashboard");
      router.refresh();
    },

    onError(error: unknown) {
      if (
        axios.isAxiosError<
          GoogleLoginErrorResponse
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
            "Google authentication failed.",
        );

        return;
      }

      if (error instanceof Error) {
        toast.error(error.message);
        return;
      }

      toast.error(
        "Google authentication failed.",
      );
    },
  });
}