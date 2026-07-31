"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { authService } from "@/services/auth.service";

import { useAuthStore } from "../store/auth.store";

type ApiErrorResponse = {
  success?: boolean;
  message?: string;
};

function getLogoutErrorMessage(error: unknown): string {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    return (
      error.response?.data?.message ??
      "The server could not complete the logout request."
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "The server could not complete the logout request.";
}

export function useLogout() {
  const router = useRouter();

  const clearAuth = useAuthStore(
    (state) => state.clearAuth
  );

  return useMutation({
    mutationFn: async () => {
      /*
       * Read the latest refresh token directly from
       * the Zustand store when logout is triggered.
       */
      const refreshToken =
        useAuthStore.getState().refreshToken;

      /*
       * The user may already have an incomplete or
       * expired local session.
       *
       * In that case, there is no refresh token to
       * send to the backend.
       */
      if (!refreshToken) {
        return null;
      }

      return authService.logout({
        refreshToken,
      });
    },

    onSuccess(response) {
      toast.success(
        response?.message ?? "Signed out successfully."
      );
    },

    onError(error: unknown) {
      /*
       * Even when the backend request fails because
       * of network issues, we will still clear the
       * frontend session inside onSettled.
       */
      toast.error(getLogoutErrorMessage(error));
    },

    onSettled() {
      /*
       * onSettled runs after both success and failure.
       *
       * The user should always be signed out from the
       * current browser even when the backend is
       * temporarily unavailable.
       */
      clearAuth();

      router.replace("/login");
      router.refresh();
    },
  });
}                         