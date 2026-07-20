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



// Find currently joined participants and include basic user details
export const findJoinedParticipants = async (
  meetingId: string
) => {
  return MeetingParticipant.find({
    meetingId: new Types.ObjectId(meetingId),
    status: "joined",
  })
    .populate(
      "userId",
      "name email avatar"
    )
    .sort({
      joinedAt: 1,
    });
};  



// Mark all currently joined participants as left
export const markAllParticipantsAsLeft = async (
  meetingId: string
) => {
  const leftAt = new Date();

  return MeetingParticipant.updateMany(
    {
      meetingId: new Types.ObjectId(meetingId),
      status: "joined",
    },
    {
      status: "left",
      leftAt,
    }
  );
};