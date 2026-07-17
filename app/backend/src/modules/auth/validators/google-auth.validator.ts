import { z } from "zod";

// Validates the credential received from Google Sign-In
export const googleAuthSchema = z.object({
  credential: z
    .string()
    .min(1, "Google credential is required"),
});

// TypeScript type generated from the same schema
export type GoogleAuthInput = z.infer<typeof googleAuthSchema>;