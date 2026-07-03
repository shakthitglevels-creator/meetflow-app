import { z } from "zod";

// Validation rules for login
export const loginSchema = z.object({

  // Email must be valid
  email: z
    .email("Invalid email"),

  // Password required
  password: z
    .string()
    .min(6, "Password must contain at least 6 characters"),
});


// TypeScript type created from Zod schema
export type LoginInput = z.infer<typeof loginSchema>;