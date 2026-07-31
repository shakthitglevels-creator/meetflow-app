import { z } from "zod";

export const verifyOtpSchema = z.object({
  otp: z
    .string()
    .trim()
    .min(1, "OTP is required.")
    .regex(/^\d{6}$/, "OTP must contain only numbers.")
    .length(6, "OTP must contain exactly 6 digits."),
});

export type VerifyOtpFormValues = z.infer<
  typeof verifyOtpSchema
>;