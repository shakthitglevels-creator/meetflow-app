// src/modules/meetings/repositories/meeting.repository.ts

import { Meeting } from "../meeting.model";
import { CreateMeetingInput } from "../dto/create-meeting.dto";

// find a meeting using a public meeting code 
export const findMeetingByCode = async (
    meetingCode: string
) => {
    return Meeting.findOne({ meetingCode })
};

// Create a new meeting document 
export const createMeeting = async (
    meetingData: CreateMeetingInput
) => {
    return Meeting.create(meetingData)
}