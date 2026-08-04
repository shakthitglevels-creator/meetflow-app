import { z } from "zod";

export const joinMeetingSchema = z.object({
  meetingCode: z
    .string()
    .trim()
    .min(
      1,
      "Meeting code is required.",
    )
    .length(
      6,
      "Meeting code must contain exactly 6 characters.",
    )
    .regex(
      /^[A-Za-z0-9]{6}$/,
      "Meeting code can contain only letters and numbers.",
    )
    .transform((value) =>
      value.toUpperCase(),
    ),
});

export type JoinMeetingFormValues =
  z.infer<typeof joinMeetingSchema>;