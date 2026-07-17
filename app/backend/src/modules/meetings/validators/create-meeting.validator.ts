import {z} from "zod";

// Request body validation for an instant meeting 
export const createMeetingSchema = z.object({
    title: z
        .string()
        .trim()
        .min(1, "Meeting title cannot be empty")
        .max(100, "Meeting title cannot exceed 100 character")
        .optional()
});

export type CreateMeetingRequest = z.infer<
    typeof createMeetingSchema
>;