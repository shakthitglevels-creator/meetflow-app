import axios from "axios";

import { env } from "@/config/env";
import { AUTH_STORAGE_KEYS } from "@/modules/auth/constants/auth.constants";

export const apiClient = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 15_000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const accessToken = localStorage.getItem(
        AUTH_STORAGE_KEYS.ACCESS_TOKEN
      );

      if (accessToken) {
        config.headers.Authorization =
          `Bearer ${accessToken}`;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,

  (error) => {
    if (
      error.response?.status === 401 &&
      typeof window !== "undefined"
    ) {
      localStorage.removeItem(
        AUTH_STORAGE_KEYS.ACCESS_TOKEN
      );

      localStorage.removeItem(
        AUTH_STORAGE_KEYS.REFRESH_TOKEN
      );

      localStorage.removeItem(
        AUTH_STORAGE_KEYS.AUTH_STORE
      );
    }

    return Promise.reject(error);
  }
);