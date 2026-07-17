import mongoose, {
  Document,
  Schema,
  Types,
} from "mongoose";

// Role of a user inside a specific meeting
export type MeetingParticipantRole = | "host" | "participant"

// Current participant state
export type MeetingParticipantStatus = | "joined" | "left";

export interface IMeetingParticipant extends Document {
  meetingId: Types.ObjectId;
  userId: Types.ObjectId;
  role: MeetingParticipantRole;
  status: MeetingParticipantStatus;
  joinedAt: Date;
  leftAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const meetingParticipantSchema =
  new Schema<IMeetingParticipant>(
    {
      // Meeting this participant belongs to
      meetingId: {
        type: Schema.Types.ObjectId,
        ref: "Meeting",
        required: true,
        index: true,
      },

      // User who joined the meeting
      userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
      },

      // Host or normal participant
      role: {
        type: String,
        enum: ["host", "participant"],
        default: "participant",
        required: true,
      },

      // Whether the user is currently joined or has left
      status: {
        type: String,
        enum: ["joined", "left"],
        default: "joined",
        required: true,
      },

      // Time the user joined
      joinedAt: {
        type: Date,
        required: true,
        default: Date.now,
      },

      // Time the user left
      leftAt: {
        type: Date,
        default: null,
      },
    },
    {
      timestamps: true,
    }
  );

// One user should have only one participant record per meeting
meetingParticipantSchema.index(
  {
    meetingId: 1,
    userId: 1,
  },
  {
    unique: true,
  }
);

export const MeetingParticipant =
  mongoose.model<IMeetingParticipant>(
    "MeetingParticipant",
    meetingParticipantSchema
  );