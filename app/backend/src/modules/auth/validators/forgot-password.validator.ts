import {z} from "zod"

// user only needs to provide email for forgot password 
export const forgotPasswordSchema = z.object({
    email: z.email("Invalid email address")
});

// typescript type created from schema 
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;