"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { meetingService } from "@/services/meeting.service";
import type {
  CreateMeetingRequest,
} from "@/types/meeting";

type MeetingErrorResponse = {
  success?: boolean;
  message?: string;
};

export function useCreateMeeting() {
  const router = useRouter();

  return useMutation({
    mutationFn: (
      payload: CreateMeetingRequest,
    ) => {
      return meetingService.createMeeting(
        payload,
      );
    },

    onSuccess(response) {
      const meetingCode =
        response.data.meetingCode;

      toast.success(
        response.message ??
          "Meeting created successfully.",
      );

      router.push(
        `/meetings/${meetingCode}`,
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
            "Unable to create the meeting.",
        );

        return;
      }

      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to create the meeting.",
      );
    },
  });
}