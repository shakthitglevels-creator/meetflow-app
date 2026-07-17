import { z } from "zod";

// Validates the meeting code received from the URL
export const joinMeetingParamsSchema = z.object({
  meetingCode: z
    .string()
    .trim()
    .length(6, "Meeting code must contain 6 characters")
    .transform((code) => code.toUpperCase()),
});

export type JoinMeetingParams = z.infer<
  typeof joinMeetingParamsSchema
>;