"use client";

import { useRouter } from "next/navigation";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { authService } from "@/services/auth.service";
import { useAuthStore } from "../store/auth.store";

export function useLogin() {
  const router = useRouter();

  const setAuth =
    useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: authService.login,

    onSuccess(response) {
      setAuth(response.data);

      toast.success(response.message);

      router.replace("/dashboard");
    },

    onError(error: any) {
      toast.error(
        error?.response?.data?.message ??
          "Login failed."
      );
    },
  });
}