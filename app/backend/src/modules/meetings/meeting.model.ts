import mongoose, { Document, Schema, Types } from "mongoose";

export type MeetingStatus = "scheduled" | "open" | "ended" | "cancelled" ;

export interface IMeeting extends Document {
  title: string;
  meetingCode: string;
  hostId: Types.ObjectId;
  status: MeetingStatus;
  scheduledAt?: Date;
  startedAt?: Date;
  endedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const meetingSchema = new Schema<IMeeting>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      default: "Untitled Meeting",
    },

    meetingCode: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },

    // Reference to the user who created the meeting
    hostId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    status: {
      type: String,
      enum: ["scheduled", "open", "ended", "cancelled"],
      required: true,
      default: "open",
    },

    scheduledAt: {
      type: Date,
      default: null,
    },

    startedAt: {
      type: Date,
      default: null,
    },

    endedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export const Meeting = mongoose.model<IMeeting>(
  "Meeting",
  meetingSchema
);