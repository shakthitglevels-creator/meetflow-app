import { z } from "zod";

export const resetPasswordSchema = z
  .object({
    otp: z
      .string()
      .trim()
      .regex(
        /^\d{6}$/,
        "Enter the complete 6-digit reset code.",
      ),

    newPassword: z
      .string()
      .min(
        8,
        "Password must contain at least 8 characters.",
      )
      .max(
        100,
        "Password cannot exceed 100 characters.",
      )
      .regex(
        /[A-Z]/,
        "Password must contain an uppercase letter.",
      )
      .regex(
        /[a-z]/,
        "Password must contain a lowercase letter.",
      )
      .regex(
        /\d/,
        "Password must contain a number.",
      )
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain a special character.",
      ),

    confirmPassword: z
      .string()
      .min(
        1,
        "Confirm your new password.",
      ),
  })
  .refine(
    (values) =>
      values.newPassword ===
      values.confirmPassword,
    {
      message: "Passwords do not match.",
      path: ["confirmPassword"],
    },
  );

export type ResetPasswordFormValues =
  z.infer<typeof resetPasswordSchema>;