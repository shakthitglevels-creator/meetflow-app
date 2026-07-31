// // src/modules/users/repositories/user.repository.ts

// import { User } from "../../../users/user.model";

// // Find one user using their email
// export const findUserByEmail = async (email: string) => {
//   return User.findOne({ email });
// };

// // Find one user using their MongoDB ID
// export const findUserById = async (userId: string) => {
//   return User.findById(userId);
// };



import {
  User,
  type IUser,
  type UserStatus,
} from "../../../users/user.model";

export type CreateUserInput = {
  name: string;
  email: string;
  password?: string;

  authProvider: "local" | "google";
  googleId?: string;
  avatar?: string;

  role?: "user" | "admin";

  status: UserStatus;
  isEmailVerified: boolean;
  emailVerifiedAt?: Date | null;
};

// Find a user using a normalized email address
export const findUserByEmail = async (
  email: string,
): Promise<IUser | null> => {
  return User.findOne({
    email: email.trim().toLowerCase(),
  });
};

// Find a user using the MongoDB document ID
export const findUserById = async (
  userId: string,
): Promise<IUser | null> => {
  return User.findById(userId);
};

// Create a user
export const createUser = async (
  input: CreateUserInput,
): Promise<IUser> => {
  return User.create(input);
};

// Activate a pending account after successful OTP verification
export const markUserEmailAsVerified = async (
  userId: string,
): Promise<IUser | null> => {
  return User.findOneAndUpdate(
    {
      _id: userId,
      status: "pending_verification",
      isEmailVerified: false,
    },
    {
      $set: {
        status: "active",
        isEmailVerified: true,
        emailVerifiedAt: new Date(),
      },
    },
    {
      new: true,
    },
  );
};

// Update the last successful login time
export const updateLastLoginAt = async (
  userId: string,
): Promise<void> => {
  await User.updateOne(
    {
      _id: userId,
    },
    {
      $set: {
        lastLoginAt: new Date(),
      },
    },
  );
};

// Update a user's password
export const updateUserPassword = async (
  userId: string,
  hashedPassword: string,
): Promise<void> => {
  await User.updateOne(
    {
      _id: userId,
    },
    {
      $set: {
        password: hashedPassword,
      },
    },
  );
};