



import mongoose, {
  Document,
  Schema,
} from "mongoose";

// Roles available inside MeetFlow
export type UserRole = "user" | "admin";

// Supported authentication providers
export type AuthProvider = "local" | "google";

// Current state of the user account
export type UserStatus =
  | "pending_verification"
  | "active"
  | "suspended";

// TypeScript representation of a MongoDB user document
export interface IUser extends Document {
  name: string;
  email: string;

  /*
   * This field contains the bcrypt password hash,
   * never the user's plain-text password.
   *
   * It is optional because Google-only accounts
   * may not have a local password.
   */
  password?: string;

  authProvider: AuthProvider;
  googleId?: string;
  avatar?: string;

  role: UserRole;

  status: UserStatus;
  isEmailVerified: boolean;
  emailVerifiedAt?: Date | null;

  lastLoginAt?: Date | null;

  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    authProvider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
      required: true,
    },

    /*
     * Required only when this is a local
     * email-and-password account.
     */
    password: {
      type: String,

      required: function (this: IUser) {
        return this.authProvider === "local";
      },
    },

    googleId: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },

    avatar: {
      type: String,
      default: null,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
      required: true,
    },

    /*
     * Local users remain pending until
     * their six-digit OTP is verified.
     */
    status: {
      type: String,
      enum: [
        "pending_verification",
        "active",
        "suspended",
      ],
      default: "pending_verification",
      required: true,
      index: true,
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
      required: true,
      index: true,
    },

    emailVerifiedAt: {
      type: Date,
      default: null,
    },

    lastLoginAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

export const User = mongoose.model<IUser>(
  "User",
  userSchema,
);