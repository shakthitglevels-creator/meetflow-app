import { create } from "zustand";
import { persist } from "zustand/middleware";

import { AUTH_STORAGE_KEYS } from "../constants/auth.constants";

import type {
  AuthUser,
  LoginResponseData,
} from "@/types/auth";

type AuthState = {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
};

type AuthActions = {
  setAuth: (authData: LoginResponseData) => void;
  setAccessToken: (accessToken: string) => void;
  clearAuth: () => void;
  setHydrated: (isHydrated: boolean) => void;
};

type AuthStore = AuthState & AuthActions;

const initialAuthState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isHydrated: false,
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      ...initialAuthState,

      setAuth: (authData) => {
        localStorage.setItem(
          AUTH_STORAGE_KEYS.ACCESS_TOKEN,
          authData.accessToken
        );

        localStorage.setItem(
          AUTH_STORAGE_KEYS.REFRESH_TOKEN,
          authData.refreshToken
        );

        set({
          user: authData.user,
          accessToken: authData.accessToken,
          refreshToken: authData.refreshToken,
          isAuthenticated: true,
        });
      },

      setAccessToken: (accessToken) => {
        localStorage.setItem(
          AUTH_STORAGE_KEYS.ACCESS_TOKEN,
          accessToken
        );

        set({
          accessToken,
          isAuthenticated: true,
        });
      },

      clearAuth: () => {
        localStorage.removeItem(
          AUTH_STORAGE_KEYS.ACCESS_TOKEN
        );

        localStorage.removeItem(
          AUTH_STORAGE_KEYS.REFRESH_TOKEN
        );

        set({
          ...initialAuthState,
          isHydrated: true,
        });
      },

      setHydrated: (isHydrated) => {
        set({
          isHydrated,
        });
      },
    }),
    {
      name: AUTH_STORAGE_KEYS.AUTH_STORE,

      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),

      onRehydrateStorage: () => {
        return (state) => {
          state?.setHydrated(true);
        };
      },
    }
  )
);