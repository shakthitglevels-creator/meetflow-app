"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { meetingService } from "@/services/meeting.service";

type MeetingErrorResponse = {
  success?: boolean;
  message?: string;
};

export function useJoinMeeting() {
  const router = useRouter();

  return useMutation({
    mutationFn: (
      meetingCode: string,
    ) => {
      return meetingService.joinMeeting(
        meetingCode,
      );
    },

    onSuccess(response) {
      const meetingCode =
        response.data.meeting.meetingCode;

      toast.success(
        response.message ??
          "Meeting joined successfully.",
      );

      router.push(
        `/meetings/${meetingCode}/room`,
      );
    },

    onError(error: unknown) {
      if (
        axios.isAxiosError<
          MeetingErrorResponse
        >(error)
      ) {
        if (!error.response) {
          toast.error(
            "Cannot connect to the backend.",
          );

          return;
        }

        toast.error(
          error.response.data?.message ??
            "Unable to join the meeting.",
        );

        return;
      }

      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to join the meeting.",
      );
    },
  });
}