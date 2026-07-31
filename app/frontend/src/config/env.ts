// // Centralized frontend environment configuration
// export const env = {
//   apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
//   socketUrl: process.env.NEXT_PUBLIC_SOCKET_URL,
// } as const;

// // Fail early when required environment variables are missing
// if (!env.apiBaseUrl) {
//   throw new Error(
//     "NEXT_PUBLIC_API_BASE_URL is not configured",
//   );
// }

// if (!env.socketUrl) {
//   throw new Error(
//     "NEXT_PUBLIC_SOCKET_URL is not configured",
//   );
// }




import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_API_BASE_URL: z
    .string()
    .url(),

  NEXT_PUBLIC_SOCKET_URL: z
    .string()
    .url(),

  NEXT_PUBLIC_GOOGLE_CLIENT_ID: z
    .string()
    .min(
      1,
      "NEXT_PUBLIC_GOOGLE_CLIENT_ID is required",
    ),
});

export const env = envSchema.parse({
  NEXT_PUBLIC_API_BASE_URL:
    process.env.NEXT_PUBLIC_API_BASE_URL,

  NEXT_PUBLIC_SOCKET_URL:
    process.env.NEXT_PUBLIC_SOCKET_URL,

  NEXT_PUBLIC_GOOGLE_CLIENT_ID:
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
});