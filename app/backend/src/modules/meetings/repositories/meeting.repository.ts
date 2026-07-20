// src/modules/meetings/repositories/meeting.repository.ts

import { Meeting } from "../meeting.model";
import { CreateMeetingInput } from "../dto/create-meeting.dto";

// find a meeting using a public meeting code 
export const findMeetingByCode = async (
    meetingCode: string
) => {
    return Meeting.findOne({ meetingCode, }).populate("hostId", "name avatar email")
};

// Create a new meeting document 
export const createMeeting = async (
    meetingData: CreateMeetingInput
) => {
    return Meeting.create(meetingData)
}


// Mark a meeting as ended
export const markMeetingAsEnded = async (
  meetingId: string
) => {
  return Meeting.findByIdAndUpdate(
    meetingId,
    {
      status: "ended",
      endedAt: new Date(),
    },
    {
      new: true,
    }
  );
};