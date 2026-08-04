export type MeetingStatus =
  | "scheduled"
  | "open"
  | "ended"
  | "cancelled";

export type ParticipantRole =
  | "host"
  | "participant";

export type ParticipantStatus =
  | "joined"
  | "left";

export interface MeetingHost {
  id: string;
  name: string;
  email: string;
  avatar?: string | null;
}

export interface Meeting {
  id: string;
  title: string;
  meetingCode: string;
  hostId: string;
  status: MeetingStatus;
  scheduledAt?: string | null;
  startedAt?: string | null;
  endedAt?: string | null;
  createdAt: string;
}

export interface MeetingDetails {
  id: string;
  title: string;
  meetingCode: string;
  status: MeetingStatus;
  host: MeetingHost;
  participantCount: number;
  scheduledAt?: string | null;
  startedAt?: string | null;
  endedAt?: string | null;
  createdAt: string;
}

export interface CreateMeetingRequest {
  title?: string;
}

export interface CreateMeetingResponseData {
  id: string;
  title: string;
  meetingCode: string;
  hostId: string;
  status: MeetingStatus;
  startedAt?: string | null;
  createdAt: string;
}

export interface MeetingParticipant {
  id: string;
  role: ParticipantRole;
  status: ParticipantStatus;
  joinedAt: string;
  leftAt?: string | null;
}

export interface JoinMeetingResponseData {
  meeting: Meeting;
  participant: MeetingParticipant;
}