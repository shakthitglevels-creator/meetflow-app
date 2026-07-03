import { z } from "zod";

// Validation rules for user registration 
export const registerSchema = z.object({
    name: z.string().min(3, "Name must contain atleast 3 characters"),
    email: z.email("Invalid email address"),
    password: z.string().min(6, "Password must contain atleast 6 characters"),

})

// TypeScript type created from Zod schema
export type RegisterInput = z.infer<typeof registerSchema>;