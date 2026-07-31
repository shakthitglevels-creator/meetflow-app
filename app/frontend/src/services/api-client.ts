// import axios from "axios";

// import { env } from "@/config/env";
// import { AUTH_STORAGE_KEYS } from "@/modules/auth/constants/auth.constants";

// export const apiClient = axios.create({
//   baseURL: env.NEXT_PUBLIC_API_BASE_URL,
//   timeout: 15_000,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// apiClient.interceptors.request.use(
//   (config) => {
//     if (typeof window !== "undefined") {
//       const accessToken = localStorage.getItem(
//         AUTH_STORAGE_KEYS.ACCESS_TOKEN
//       );

//       if (accessToken) {
//         config.headers.Authorization =
//           `Bearer ${accessToken}`;
//       }
//     }

//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// apiClient.interceptors.response.use(
//   (response) => response,

//   (error) => {
//     if (
//       error.response?.status === 401 &&
//       typeof window !== "undefined"
//     ) {
//       localStorage.removeItem(
//         AUTH_STORAGE_KEYS.ACCESS_TOKEN
//       );

//       localStorage.removeItem(
//         AUTH_STORAGE_KEYS.REFRESH_TOKEN
//       );

//       localStorage.removeItem(
//         AUTH_STORAGE_KEYS.AUTH_STORE
//       );
//     }

//     return Promise.reject(error);
//   }
// );



import axios, {
  AxiosError,
  type InternalAxiosRequestConfig,
} from "axios";

import { env } from "@/config/env";
import { useAuthStore } from "@/modules/auth/store/auth.store";

import type {
  ApiResponse,
  RefreshTokenResponseData,
} from "@/types/auth";

/*
 * Extend Axios's internal request configuration
 * with a private flag.
 *
 * The flag prevents one failed request from being
 * retried repeatedly in an infinite loop.
 */
type RetryableRequestConfig =
  InternalAxiosRequestConfig & {
    _retry?: boolean;
  };

/*
 * Shape expected when the refresh-token endpoint
 * returns a successful response.
 */
type RefreshResponse =
  ApiResponse<RefreshTokenResponseData>;

/*
 * Main API client used throughout MeetFlow.
 */
export const apiClient =
  axios.create({
    baseURL:
      env.NEXT_PUBLIC_API_BASE_URL,

    timeout: 10000,

    headers: {
      "Content-Type":
        "application/json",
    },
  });

/*
 * A separate Axios instance is used only for
 * refreshing access tokens.
 *
 * It deliberately has no response interceptor.
 * Otherwise a 401 from refresh-token could trigger
 * another refresh request and create a loop.
 */
const refreshClient =
  axios.create({
    baseURL:
      env.NEXT_PUBLIC_API_BASE_URL,

    timeout: 10000,

    headers: {
      "Content-Type":
        "application/json",
    },
  });

/*
 * Stores the currently running refresh request.
 *
 * When several API calls fail with 401 at the same
 * time, they all wait for this same Promise instead
 * of sending multiple refresh requests.
 */
let refreshPromise:
  Promise<string> | null = null;

/*
 * These authentication endpoints must never start
 * the automatic refresh flow.
 *
 * For example, invalid login credentials may return
 * 401, but that does not mean the existing access
 * token should be refreshed.
 */
const publicAuthEndpoints = [
  "/auth/login",
  "/auth/register",
  "/auth/google",
  "/auth/send-otp",
  "/auth/verify-otp",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/auth/refresh-token",
];

/*
 * Checks whether the failed request is one of the
 * public authentication endpoints.
 */
function isPublicAuthRequest(
  url?: string,
): boolean {
  if (!url) {
    return false;
  }

  return publicAuthEndpoints.some(
    (endpoint) =>
      url.includes(endpoint),
  );
}

/*
 * Remove the frontend authentication state and
 * return the user to login.
 */
function expireFrontendSession(): void {
  useAuthStore
    .getState()
    .clearAuth();

  /*
   * This file can also be evaluated during server
   * rendering, where window does not exist.
   */
  if (
    typeof window !== "undefined"
  ) {
    const currentPath =
      window.location.pathname;

    const isAlreadyOnAuthPage =
      currentPath === "/login" ||
      currentPath === "/register" ||
      currentPath ===
        "/forgot-password" ||
      currentPath ===
        "/reset-password" ||
      currentPath ===
        "/verify-otp";

    if (!isAlreadyOnAuthPage) {
      const redirectPath =
        encodeURIComponent(
          currentPath,
        );

      window.location.replace(
        `/login?sessionExpired=true&redirect=${redirectPath}`,
      );
    }
  }
}

/*
 * Send one refresh-token request.
 */
async function requestNewAccessToken():
  Promise<string> {
  const {
    refreshToken,
    setAccessToken,
  } =
    useAuthStore.getState();

  if (!refreshToken) {
    throw new Error(
      "Refresh token is missing.",
    );
  }

  const response =
    await refreshClient.post<
      RefreshResponse
    >(
      "/auth/refresh-token",
      {
        refreshToken,
      },
    );

  const newAccessToken =
    response.data.data
      .accessToken;

  if (!newAccessToken) {
    throw new Error(
      "The server did not return a new access token.",
    );
  }

  /*
   * Update Zustand and its persisted state.
   */
  setAccessToken(
    newAccessToken,
  );

  return newAccessToken;
}

/*
 * Get the currently running refresh operation,
 * or create one when no refresh is in progress.
 */
function getNewAccessToken():
  Promise<string> {
  if (!refreshPromise) {
    refreshPromise =
      requestNewAccessToken()
        .finally(() => {
          /*
           * Clear the shared Promise after success
           * or failure so future expiry events can
           * start another refresh.
           */
          refreshPromise = null;
        });
  }

  return refreshPromise;
}

/*
 * Request interceptor
 *
 * Runs before every request made through apiClient.
 * It reads the latest access token directly from
 * Zustand and attaches it to Authorization.
 */
apiClient.interceptors.request.use(
  (
    config:
      InternalAxiosRequestConfig,
  ) => {
    const accessToken =
      useAuthStore
        .getState()
        .accessToken;

    if (accessToken) {
      config.headers.Authorization =
        `Bearer ${accessToken}`;
    }

    return config;
  },

  (error: unknown) => {
    return Promise.reject(error);
  },
);

/*
 * Response interceptor
 *
 * Successful responses pass through unchanged.
 * Eligible 401 responses trigger token refresh.
 */
apiClient.interceptors.response.use(
  (response) => response,

  async (
    error:
      AxiosError,
  ) => {
    const originalRequest =
      error.config as
        | RetryableRequestConfig
        | undefined;

    const status =
      error.response?.status;

    /*
     * Do not refresh when:
     *
     * - there is no original request;
     * - error is not HTTP 401;
     * - request was already retried;
     * - request is a public auth operation.
     */
    if (
      !originalRequest ||
      status !== 401 ||
      originalRequest._retry ||
      isPublicAuthRequest(
        originalRequest.url,
      )
    ) {
      return Promise.reject(error);
    }

    const {
      accessToken,
      refreshToken,
    } =
      useAuthStore.getState();

    /*
     * An automatic refresh is valid only when the
     * browser currently has both authentication
     * tokens.
     */
    if (
      !accessToken ||
      !refreshToken
    ) {
      expireFrontendSession();

      return Promise.reject(error);
    }

    /*
     * Mark this request before starting refresh.
     * It can now be retried only once.
     */
    originalRequest._retry = true;

    try {
      const newAccessToken =
        await getNewAccessToken();

      /*
       * Replace the old Authorization header on
       * the failed request.
       */
      originalRequest.headers.Authorization =
        `Bearer ${newAccessToken}`;

      /*
       * Retry the exact original request:
       *
       * - same URL;
       * - same HTTP method;
       * - same body;
       * - same query parameters;
       * - new access token.
       */
      return apiClient(
        originalRequest,
      );
    } catch (
      refreshError: unknown
    ) {
      /*
       * The refresh token or backend session is no
       * longer valid.
       */
      expireFrontendSession();

      return Promise.reject(
        refreshError,
      );
    }
  },
);