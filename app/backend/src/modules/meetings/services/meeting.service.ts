import { Types } from "mongoose";
import { generateMeetingCode } from "../utils/meeting-code";
import {
  createMeeting,
  findMeetingByCode,
} from "../repositories/meeting.repository";

import {
  createMeetingParticipant,
  findMeetingParticipant,
  markParticipantAsJoined,
  markParticipantAsLeft,
  countJoinedParticipants,
  findJoinedParticipants,
} from "../repositories/meeting-participant.repository";

import { AppError } from "../../../shared/errors/app-error";

export const createMeetingService = async (hostId: string, title?: string) => {
  // Use the user's title, or apply the default title
  const meetingTitle = title?.trim() || "Untitled Meeting";

  // Generate the first meeting-code candidate
  let meetingCode = generateMeetingCode();

  // Check whether that code already exists
  let existingMeeting = await findMeetingByCode(meetingCode);

  // Keep generating until we find an unused code
  while (existingMeeting) {
    meetingCode = generateMeetingCode();
    existingMeeting = await findMeetingByCode(meetingCode);
  }

  // Create an instant active meeting
  const startedAt = new Date();
  const meeting = await createMeeting({
    title: meetingTitle,
    meetingCode,
    hostId: new Types.ObjectId(hostId),
    status: "open",
    startedAt,
  });

  return {
    id: meeting._id,
    title: meeting.title,
    meetingCode: meeting.meetingCode,
    hostId: meeting.hostId,
    status: meeting.status,
    startedAt: meeting.startedAt,
    createdAt: meeting.createdAt,
  };
};

// get meeting details
export const getMeetingDetailsService = async (meetingCode: string) => {
  const meeting = await findMeetingByCode(meetingCode);

  if (!meeting) {
    throw new AppError("Meeting not found", 404);
  }

  // Count only participants who are currently inside
  const participantCount = await countJoinedParticipants(
    meeting._id.toString(),
  );

  // Populated host data
  const host = meeting.hostId as any;

  return {
    id: meeting._id,
    title: meeting.title,
    meetingCode: meeting.meetingCode,
    status: meeting.status,

    host: {
      id: host._id,
      name: host.name,
      avatar: host.avatar,
      email: host.email,
    },

    participantCount,
    scheduledAt: meeting.scheduledAt,
    startedAt: meeting.startedAt,
    endedAt: meeting.endedAt,
    hostId: meeting.hostId,
  };
};

// clean API-ready data
const buildJoinMeetingResponse = (meeting: any, participant: any) => {
  return {
    meeting: {
      id: meeting._id,
      title: meeting.title,
      meetingCode: meeting.meetingCode,
      hostId: meeting.hostId,
      status: meeting.status,
      startedAt: meeting.startedAt,
    },

    participant: {
      id: participant._id,
      role: participant.role,
      status: participant.status,
      joinedAt: participant.joinedAt,
    },
  };
};

// a existing meeting with a code give by the host of the meeting enter the code in the meetflow app then join
export const joinMeetingService = async (
  meetingCode: string,
  userId: string,
) => {
  const meeting = await findMeetingByCode(meetingCode);

  if (!meeting) {
    throw new AppError("Meeting not found", 400);
  }

  // this block checks whether the meeting is joinable.
  if (meeting.status !== ("open" as unknown as typeof meeting.status)) {
    throw new AppError("This meeting is not available to join", 403);
  }

  const existingParticipant = await findMeetingParticipant(
    meeting._id.toString(),
    userId,
  );

  if (!existingParticipant) {
    const participant = await createMeetingParticipant(
      meeting._id.toString(),
      userId,
      meeting.hostId.toString() === userId ? "host" : "participant",
    );

    return {
      meeting,
      participant,
    };
  }

  if (existingParticipant.status === "left") {
    const participant = await markParticipantAsJoined(
      existingParticipant._id.toString(),
    );
    return {
      meeting,
      participant,
    };
  }

  // User is already joined, so return the same record
  return {
    meeting,
    participant: existingParticipant,
  };
};

export const leaveMeetingService = async (
  meetingCode: string,
  userId: string,
) => {
  const meeting = await findMeetingByCode(meetingCode);
  if (!meeting) {
    throw new AppError("Meeting not found", 404);
  }

  const participant = await findMeetingParticipant(
    meeting._id.toString(),
    userId,
  );

  if (!participant) {
    throw new AppError("You have not joined this meeting", 404);
  }

  if (participant.status === "left") {
    return {
      meetingCode: meeting.meetingCode,
      participantId: participant._id,
      status: participant.status,
      leftAt: participant.leftAt,
    };
  }

  const updatedParticipant = await markParticipantAsLeft(
    participant._id.toString(),
  );

  if (!updatedParticipant) {
    throw new AppError("Unable to leave the meeting", 500);
  }

  return {
    meetingCode: meeting.meetingCode,
    participantId: updatedParticipant._id,
    status: updatedParticipant.status,
    leftAt: updatedParticipant.leftAt,
  };
};

export const getMeetingParticipantsService = async (meetingCode: string) => {
  const meeting = await findMeetingByCode(meetingCode);

  if (!meeting) {
    throw new AppError("Meeting not found", 404);
  }

  const participants = await findJoinedParticipants(meeting._id.toString());

  return participants.map((participant: any) => ({
    id: participant._id,

    role: participant.role,

    status: participant.status,

    joinedAt: participant.joinedAt,

    user: {
      id: participant.userId._id,

      name: participant.userId.name,

      avatar: participant.userId.avatar,

      email: participant.userId.email,
    },
  }));
};
