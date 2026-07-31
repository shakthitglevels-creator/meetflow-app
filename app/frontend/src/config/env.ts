// Centralized frontend environment configuration
export const env = {
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  socketUrl: process.env.NEXT_PUBLIC_SOCKET_URL,
} as const;

// Fail early when required environment variables are missing
if (!env.apiBaseUrl) {
  throw new Error(
    "NEXT_PUBLIC_API_BASE_URL is not configured",
  );
}

if (!env.socketUrl) {
  throw new Error(
    "NEXT_PUBLIC_SOCKET_URL is not configured",
  );
}