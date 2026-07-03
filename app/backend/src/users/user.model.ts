// src/modules/users/user.model.ts

// global imports
import mongoose from "mongoose";
import { Schema, Document } from "mongoose";

// Allowed user roles in meetflow
export type UserRole = "user" | "admin";

// typescript shape of a user document
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  avatar?: string;
  role: UserRole;
  isEmailVerified: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// mongodb schema definition

const userSchema = new Schema<IUser>({
  // user displays name
  name: {
    type: String,
    required: true,
    trim: true,
  },

  // Email must be unique because it is used for login 
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true
  },

  // Hashed password will be stored here not a plain password 
  password: {
    type: String,
    required: true,
  },

  // profile user image url 
  avatar: {
    type: String,
    default: null,
  },

  // role for rbac later 
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },

//   used for Otp/email verification flow later
  isEmailVerified: {
    type: Boolean,
    default: false,
  },

  // updated when user logs in 
  lastLoginAt: {
    type: Date,
    default: null,
  },
}, {
    timestamps: true
});


// export user model 
export const User = mongoose.model<IUser>("User", userSchema)