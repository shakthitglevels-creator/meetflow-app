import { z } from "zod"

// User provides email, otp and new password 
export const resetPasswordSchema = z.object({
    email: z.email("Invalid email address"),

    otp: z
        .string()
        .length(6, "OTP must be 6 digits"),


    newPassword: z
        .string()
        .min(6, "OTP must be 6 digits"),

})

// TypeScript type created from schema
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;



