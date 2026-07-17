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
