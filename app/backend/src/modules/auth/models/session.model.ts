import mongoose, { Schema, Document, Types } from "mongoose";

// typescript shape of a session documenents
export interface ISession extends Document {
  userId: Types.ObjectId;
  refreshToken: string;
  userAgent?: string;
  ipAddress?: string;
  expiresAt: Date;
  createdAt: Date;
  updateAt: Date;
}

// MongoDb schema for login sessions
const sessionSchema = new Schema<ISession>({
  // which user own this session
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },

  // Refresh token stored for this login sessions
  refreshToken: {
    type: String,
    required: true,
  },

  // Browser/device info, useful for "logged in devices" later
  userAgent: {
    type: String,
    default: null,
  },

  // Ip Address usefull for security logs later 
  ipAddress: {
    type: String,
    default: null,
  },

  // When this sessions should expire 
  expiresAt: {
    type: Date,
    required: true,
  },

},
    {
        timestamps: true,
    }
);



// Automatically delete expired sessions from MongoDB
sessionSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0 }
);

// Export Session model
export const Session = mongoose.model<ISession>(
  "Session",
  sessionSchema
);