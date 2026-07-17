import { Types } from "mongoose";
import { MeetingParticipant } from "../meeting-participant.model";

// find one participants record for one meeting
export const findMeetingParticipant = async (
  meetingId: string,
  userId: string,
) => {
  return MeetingParticipant.findOne({
    meetingId: new Types.ObjectId(meetingId),
    userId: new Types.ObjectId(userId),
  });
};

// create a new participant record
export const createMeetingParticipant = async (
  meetingId: string,
  userId: string,
  role: "host" | "participant",
) => {
  return MeetingParticipant.create({
    meetingId: new Types.ObjectId(meetingId),
    userId: new Types.ObjectId(userId),
    role,
    status: "joined",
    joinedAt: new Date(),
    leftAt: undefined,
  });
};

// Mark an existing participant as joined again
export const markParticipantAsJoined = async (
  participantId: string
) => {
  return MeetingParticipant.findByIdAndUpdate(
    participantId,
    {
      status: "joined",
      joinedAt: new Date(),
      leftAt: null,
    },
    {
      new: true,
    }
  );
};

// Mark an existing participant as having left the meeting
export const markParticipantAsLeft = async (
  participantId: string
) => {
  return MeetingParticipant.findByIdAndUpdate(
    participantId,
    {
      status: "left",
      leftAt: new Date(),
    },
    {
      new: true,
    }
  )
}


// count users who are currently inside he meeting 
export const countJoinedParticipants = async (meetingId: string) => {
  return MeetingParticipant.countDocuments({
    meetingId: new Types.ObjectId(meetingId),
    status: "joined",
  })
}