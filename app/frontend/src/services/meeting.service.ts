import { apiClient } from "@/services/api-client";

import type { ApiResponse } from "@/types/auth";
import type {
  CreateMeetingRequest,
  CreateMeetingResponseData,
  JoinMeetingResponseData,
  MeetingDetails,
} from "@/types/meeting";

export const meetingService = {
  createMeeting: async (
    payload: CreateMeetingRequest,
  ): Promise<
    ApiResponse<CreateMeetingResponseData>
  > => {
    const response = await apiClient.post<
      ApiResponse<CreateMeetingResponseData>
    >("/meetings", payload);

    return response.data;
  },

  getMeetingDetails: async (
    meetingCode: string,
  ): Promise<ApiResponse<MeetingDetails>> => {
    const response = await apiClient.get<
      ApiResponse<MeetingDetails>
    >(`/meetings/${meetingCode}`);

    return response.data;
  },

  joinMeeting: async (
    meetingCode: string,
  ): Promise<
    ApiResponse<JoinMeetingResponseData>
  > => {
    const response = await apiClient.post<
      ApiResponse<JoinMeetingResponseData>
    >(`/meetings/${meetingCode}/join`);

    return response.data;
  },
};