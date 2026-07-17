import { Types } from "mongoose";

// Data required by the repository to create a meeting 
export interface CreateMeetingInput {
    title: string;
    meetingCode: string;
    hostId: Types.ObjectId;
    status: "scheduled" | "open" | "ended" | "cancelled";
    startedAt?: Date;
    scheduledAt?: Date;
    
}