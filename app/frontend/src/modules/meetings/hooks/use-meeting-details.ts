"use client";

import { useQuery } from "@tanstack/react-query";

import { meetingService } from "@/services/meeting.service";

export function useMeetingDetails(
  meetingCode: string,
) {
  return useQuery({
    queryKey: [
      "meeting",
      meetingCode,
    ],

    queryFn: () =>
      meetingService.getMeetingDetails(
        meetingCode,
      ),

    enabled: Boolean(meetingCode),

    retry: 1,
  });
}